import { useState } from "react"
import { toast } from "react-toastify"
import citasMedicasService from "../apiservice/citasmedicas-service"
import { useAuth } from "../context/AuthContext"
import ModalHistoriaMedica from "./ModalHistoriaMedica"
import ModalRegistrarAtencion from "./ModalRegistrarAtencion"
import ModalVerAtencion from "./ModalVerAtencion"

export default function ModalVerCitaMedica({ isOpen, onClose, onSave, cita }) {
  const [enviando, setEnviando] = useState(false)
  const [isModalHistoriaOpen, setIsModalHistoriaOpen] = useState(false)
  const [isModalRegistrarAtencionOpen, setIsModalRegistrarAtencionOpen] = useState(false)
  const [isModalVerAtencionOpen, setIsModalVerAtencionOpen] = useState(false)
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

  if (!isOpen || !cita) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in slide-in-from-bottom duration-300">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Detalles de la Cita</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Paciente</p>
              <p className="text-foreground font-medium">
                {cita.paciente?.nombre} {cita.paciente?.apellido}
              </p>
            </div>
            {user?.rol === "MEDICO" && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Historia Médica</p>
                {/* Botón solo visible para MEDICO */}
                
                  <button
                    onClick={() => handleHistoriaMedica(cita.paciente?.dni)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 hover:cursor-pointer"
                  >
                    Ver Historia Médica
                  </button>
                
              </div>
            )}
          </div>


          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">DNI</p>
            <p className="text-foreground font-medium">{cita.paciente?.dni}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Fecha</p>
              <p className="text-foreground font-medium">{cita.fecha}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Hora</p>
              <p className="text-foreground font-medium">{cita.hora}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Costo</p>
              <p className="text-foreground font-medium">S/. {cita.costo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Estado</p>
              <p className="text-foreground font-medium">{cita.estado}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={enviando}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium disabled:opacity-50"
            >
              Volver
            </button>
            <button
              onClick={handleCancelar}
              disabled={enviando || cita.estado === "COMPLETADA"}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
            >
              {enviando ? "..." : "Cancelar"}
            </button>
            {user?.rol === "MEDICO" && cita.estado === "PENDIENTE" && (
              <button
                onClick={handleRegistrarAtencion}
                disabled={enviando}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
              >
                Registrar Atención
              </button>
            )}
            {user?.rol === "MEDICO" && cita.estado === "COMPLETADA" && (
              <button
                onClick={handleVerAtencion}
                disabled={enviando}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
              >
                Ver Atención
              </button>
            )}
          </div>
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
      />

      <ModalVerAtencion
        isOpen={isModalVerAtencionOpen}
        onClose={() => {
          setIsModalVerAtencionOpen(false)
        }}
        idCita={cita.id}
      />
    </div>
  )
}
