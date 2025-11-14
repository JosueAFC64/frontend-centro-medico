import { useRef, useEffect, useState } from "react"
import ModalRegistroCitaMedica from "./ModalRegistroCitaMedica"
import ModalVerCitaMedica from "./ModalVerCitaMedica"

const estadoColores = {
  DISPONIBLE: "bg-green-100 text-green-800 border-green-300",
  OCUPADO: "bg-red-100 text-red-800 border-red-300",
  BLOQUEADO: "bg-yellow-100 text-yellow-800 border-yellow-300",
}

export default function DetallesPopover({ isOpen, position, detalles, onClose, onCitaRegistrada, horario }) {
  const popoverRef = useRef(null)
  const [isModalRegistroOpen, setIsModalRegistroOpen] = useState(false)
  const [isModalVerOpen, setIsModalVerOpen] = useState(false)
  const [selectedDetalle, setSelectedDetalle] = useState(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si algún modal está abierto, no cerrar el popover
      if (isModalRegistroOpen || isModalVerOpen) {
        return
      }

      // Verificar si el click está dentro del popover
      const clickedInsidePopover = popoverRef.current?.contains(event.target)

      if (!clickedInsidePopover) {
        onClose()
      }
    }

    // Solo agregar el listener si el popover está abierto y ningún modal está abierto
    // Si un modal está abierto, no necesitamos escuchar clicks fuera porque no queremos
    // cerrar el popover en ese caso
    if (isOpen && !isModalRegistroOpen && !isModalVerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, isModalRegistroOpen, isModalVerOpen])

  // Limpiar estado cuando se cierra el popover
  useEffect(() => {
    if (!isOpen) {
      setIsModalRegistroOpen(false)
      setIsModalVerOpen(false)
      setSelectedDetalle(null)
    }
  }, [isOpen])

  const handleRegistrarCita = (detalle, event) => {
    event.stopPropagation() // Prevenir que el click se propague
    setSelectedDetalle(detalle)
    setIsModalRegistroOpen(true)
  }

  const handleVerCita = (detalle, event) => {
    event.stopPropagation() // Prevenir que el click se propague
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
    onClose() // Cerrar el popover después de registrar exitosamente
  }

  if (!isOpen || !detalles || detalles.length === 0) return null

  return (
    <>
      <div
        ref={popoverRef}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-border animate-in fade-in slide-in-from-left duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          maxWidth: "350px",
        }}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm">Detalles del Horario</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {detalles.map((detalle) => (
            <div
              key={detalle.id}
              className={`p-3 rounded-lg border ${estadoColores[detalle.estado] || "bg-gray-50 border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  <span className="text-xs font-semibold uppercase">{detalle.estado}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{detalle.horaInicio}</span>
                <span className="text-xs text-current opacity-60">→</span>
                <span className="text-sm font-medium">{detalle.horaFin}</span>
              </div>

              {detalle.cita ? (
                <>
                  <div className="bg-white bg-opacity-60 p-2 rounded text-xs space-y-1 mb-2">
                    <div>
                      <span className="font-semibold">Paciente:</span> {detalle.cita.paciente.nombre}{" "}
                      {detalle.cita.paciente.apellido}
                    </div>
                    <div>
                      <span className="font-semibold">DNI:</span> {detalle.cita.paciente.dni}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleVerCita(detalle, e)}
                    className="w-full text-xs py-2 px-3 rounded font-medium bg-white bg-opacity-60 hover:bg-opacity-100 transition-colors"
                  >
                    Ver Cita Médica
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => handleRegistrarCita(detalle, e)}
                  disabled={!detalle.estaDisponible}
                  className={`w-full mt-2 text-xs py-2 px-3 rounded font-medium transition-colors ${
                    detalle.estaDisponible
                      ? "bg-white bg-opacity-60 hover:bg-opacity-100 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Registrar Cita Médica
                </button>
              )}
            </div>
          ))}
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
        onSave={onCitaRegistrada}
        cita={selectedDetalle?.cita}
      />
    </>
  )
}
