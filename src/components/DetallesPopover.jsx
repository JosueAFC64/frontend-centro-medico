import { useRef, useEffect, useState } from "react"
import ModalRegistroCitaMedica from "./ModalRegistroCitaMedica"
import ModalVerCitaMedica from "./ModalVerCitaMedica"
import { useAuth } from "../context/AuthContext"
import { X, Clock, User, FileText, CheckCircle2, AlertCircle, Ban } from "lucide-react"

const estadoConfig = {
  DISPONIBLE: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2
  },
  OCUPADO: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    text: "text-rose-700 dark:text-rose-400",
    icon: AlertCircle
  },
  BLOQUEADO: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
    icon: Ban
  },
}

export default function DetallesPopover({ isOpen, position, detalles, onClose, onCitaRegistrada, onCitaCompletadaoCancelada, horario }) {
  const popoverRef = useRef(null)
  const [isModalRegistroOpen, setIsModalRegistroOpen] = useState(false)
  const [isModalVerOpen, setIsModalVerOpen] = useState(false)
  const [selectedDetalle, setSelectedDetalle] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalRegistroOpen || isModalVerOpen) return

      const clickedInsidePopover = popoverRef.current?.contains(event.target)
      if (!clickedInsidePopover) onClose()
    }

    if (isOpen && !isModalRegistroOpen && !isModalVerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose, isModalRegistroOpen, isModalVerOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsModalRegistroOpen(false)
      setIsModalVerOpen(false)
      setSelectedDetalle(null)
    }
  }, [isOpen])

  const handleRegistrarCita = (detalle, event) => {
    event.stopPropagation()
    setSelectedDetalle(detalle)
    setIsModalRegistroOpen(true)
  }

  const handleVerCita = (detalle, event) => {
    event.stopPropagation()
    setSelectedDetalle(detalle)
    setIsModalVerOpen(true)
  }

  const handleCloseModalRegistro = () => {
    setIsModalRegistroOpen(false)
    setSelectedDetalle(null)
  }

  const handleCloseModalVer = () => {
    setIsModalVerOpen(false)
    setSelectedDetalle(null)
  }

  const handleCitaRegistrada = () => {
    onCitaRegistrada()
    onClose()
  }

  const handleCompletaroCancelarCita = () => {
    onCitaCompletadaoCancelada()
    onClose()
  }

  if (!isOpen || !detalles || detalles.length === 0) return null

  return (
    <>
      <div
        ref={popoverRef}
        className="fixed z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 w-80 md:w-96"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Detalles del Horario</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {detalles.map((detalle) => {
            const config = estadoConfig[detalle.estado] || estadoConfig.DISPONIBLE
            const StatusIcon = config.icon

            return (
              <div
                key={detalle.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${config.bg} ${config.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/50 dark:bg-black/10 ${config.text}`}>
                    <StatusIcon size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">{detalle.estado}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono text-sm font-medium bg-white/50 dark:bg-black/10 px-2 py-1 rounded-md">
                    <span>{detalle.horaInicio}</span>
                    <span className="text-slate-400">-</span>
                    <span>{detalle.horaFin}</span>
                  </div>
                </div>

                {detalle.cita ? (
                  <div className="space-y-3">
                    <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg space-y-2">
                      <div className="flex items-start gap-2">
                        <User size={14} className="mt-0.5 text-slate-500 dark:text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Paciente</p>
                          <p className="text-sm text-slate-900 dark:text-white font-medium">
                            {detalle.cita.paciente.nombre} {detalle.cita.paciente.apellido}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText size={14} className="mt-0.5 text-slate-500 dark:text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">DNI</p>
                          <p className="text-sm text-slate-900 dark:text-white font-medium">{detalle.cita.paciente.dni}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleVerCita(detalle, e)}
                      className="w-full py-2 px-3 rounded-lg font-medium text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={14} />
                      Ver Detalles de Cita
                    </button>
                  </div>
                ) : (
                  user?.rol === "PERSONAL_ADMINISTRATIVO" && (
                    <button
                      onClick={(e) => handleRegistrarCita(detalle, e)}
                      disabled={!detalle.estaDisponible}
                      className={`w-full mt-1 py-2.5 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${detalle.estaDisponible
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                        }`}
                    >
                      {detalle.estaDisponible ? (
                        <>
                          <CheckCircle2 size={14} />
                          Registrar Cita
                        </>
                      ) : (
                        <>
                          <Ban size={14} />
                          No Disponible
                        </>
                      )}
                    </button>
                  )
                )}
              </div>
            )
          })}
        </div>
      </div>

      <ModalRegistroCitaMedica
        isOpen={isModalRegistroOpen}
        onClose={handleCloseModalRegistro}
        onSave={handleCitaRegistrada}
        horarioId={horario?.id}
        detalleId={selectedDetalle?.id}
      />

      <ModalVerCitaMedica
        isOpen={isModalVerOpen}
        onClose={handleCloseModalVer}
        onSave={handleCompletaroCancelarCita}
        cita={selectedDetalle?.cita}
      />
    </>
  )
}
