import { useState } from "react"
import { toast } from "react-toastify"
import citasMedicasService from "../apiservice/citasmedicas-service"
import { useAuth } from "../context/AuthContext"
import ModalHistoriaMedica from "./ModalHistoriaMedica"
import ModalRegistrarAtencion from "./ModalRegistrarAtencion"
import ModalVerAtencion from "./ModalVerAtencion"
import ModalDelegarCita from "./ModalDelegarCita"
import { X, User, Calendar, Clock, DollarSign, Activity, FileText, AlertCircle, CheckCircle2, Ban, Loader2, UserPlus } from "lucide-react"

export default function ModalVerCitaMedica({ isOpen, onClose, onSave, cita }) {
  const [enviando, setEnviando] = useState(false)
  const [isModalHistoriaOpen, setIsModalHistoriaOpen] = useState(false)
  const [isModalRegistrarAtencionOpen, setIsModalRegistrarAtencionOpen] = useState(false)
  const [isModalVerAtencionOpen, setIsModalVerAtencionOpen] = useState(false)
  const [isModalDelegarOpen, setIsModalDelegarOpen] = useState(false)
  const [dniSeleccionado, setDniSeleccionado] = useState(null)
  const { user } = useAuth()

  const handleCancelar = async () => {
    try {
      setEnviando(true)
      await citasMedicasService.cancelarCita(cita.id)
      toast.success("Cita cancelada exitosamente")
      onSave()
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al cancelar cita")
    } finally {
      setEnviando(false)
    }
  }

  const handleHistoriaMedica = (dni) => {
    setDniSeleccionado(dni)
    setIsModalHistoriaOpen(true)
  }

  const handleRegistrarAtencion = () => {
    setIsModalRegistrarAtencionOpen(true)
  }

  const handleVerAtencion = () => {
    setIsModalVerAtencionOpen(true)
  }

  const handleDelegar = () => {
    setIsModalDelegarOpen(true)
  }

  if (!isOpen || !cita) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETADA': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'CANCELADA': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'PENDIENTE': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETADA': return CheckCircle2;
      case 'CANCELADA': return Ban;
      case 'PENDIENTE': return AlertCircle;
      default: return Activity;
    }
  }

  const StatusIcon = getStatusIcon(cita.estado);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detalles de la Cita</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Información completa de la cita médica</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Status Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${getStatusColor(cita.estado)}`}>
            <div className="p-2 bg-white/50 dark:bg-black/10 rounded-full">
              <StatusIcon size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Estado Actual</p>
              <p className="font-bold text-lg">{cita.estado}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-teal-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Paciente</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-lg">
                      {cita.paciente?.nombre} {cita.paciente?.apellido}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">DNI: {cita.paciente?.dni}</p>
                  </div>
                </div>
              </div>

              {user?.rol === "MEDICO" && (
                <button
                  onClick={() => handleHistoriaMedica(cita.paciente?.dni)}
                  className="w-full py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText size={16} />
                  Ver Historia Médica
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-blue-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Fecha</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{cita.fecha}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-indigo-500">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Hora</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{cita.hora}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 col-span-2">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-emerald-500">
                  <DollarSign size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Costo de Consulta</p>
                  <p className="font-semibold text-slate-900 dark:text-white">S/. {cita.costo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={enviando}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
            >
              Volver
            </button>
            <button
              onClick={handleCancelar}
              disabled={enviando || cita.estado === "COMPLETADA" || cita.estado === "CANCELADA"}
              className="flex-1 px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-900/30 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {enviando ? <Loader2 size={18} className="animate-spin" /> : <Ban size={18} />}
              Cancelar Cita
            </button>
          </div>

          {user?.rol === "MEDICO" && cita.estado === "PENDIENTE" && (
            <button
              onClick={handleRegistrarAtencion}
              disabled={enviando}
              className="w-full px-4 py-3 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2"
            >
              <Activity size={20} />
              Registrar Atención Médica
            </button>
          )}

          {user?.rol === "MEDICO" && cita.estado === "COMPLETADA" && (
            <button
              onClick={handleVerAtencion}
              disabled={enviando}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-teal-500 text-teal-600 dark:text-teal-400 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Ver Detalles de Atención
            </button>
          )}

          {user?.rol === "PERSONAL_ADMINISTRATIVO" && (
            <button
              onClick={handleDelegar}
              disabled={enviando || cita.estado === "COMPLETADA" || cita.estado === "CANCELADA"}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Delegar Cita
            </button>
          )}
        </div>
      </div>

      <ModalHistoriaMedica
        isOpen={isModalHistoriaOpen}
        onClose={() => {
          setIsModalHistoriaOpen(false)
          setDniSeleccionado(null)
        }}
        dni={dniSeleccionado}
      />

      <ModalRegistrarAtencion
        isOpen={isModalRegistrarAtencionOpen}
        onClose={() => {
          setIsModalRegistrarAtencionOpen(false)
        }}
        onSave={onSave}
        idCita={cita.id}
        fechaAtencion={cita.fecha}
      />

      <ModalVerAtencion
        isOpen={isModalVerAtencionOpen}
        onClose={() => {
          setIsModalVerAtencionOpen(false)
        }}
        idCita={cita.id}
      />

      <ModalDelegarCita
        isOpen={isModalDelegarOpen}
        onClose={() => {
          setIsModalDelegarOpen(false)
        }}
        onSave={onSave}
        idCita={cita.id}
      />
    </div>
  )
}
