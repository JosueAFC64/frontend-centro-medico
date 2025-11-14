import { useState } from "react"
import { toast } from "react-toastify"
import citasMedicasService from "../apiservice/citasmedicas-service"

export default function ModalVerCitaMedica({ isOpen, onClose, onSave, cita }) {
  const [enviando, setEnviando] = useState(false)

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

  const handleCompletar = async () => {
    try {
      setEnviando(true)
      await citasMedicasService.completarCita(cita.id)
      toast.success("Cita completada exitosamente")
      onSave()
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al completar cita")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen || !cita) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in slide-in-from-bottom duration-300">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Detalles de la Cita</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Paciente</p>
            <p className="text-foreground font-medium">
              {cita.paciente?.nombre} {cita.paciente?.apellido}
            </p>
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
              Cancelar
            </button>
            <button
              onClick={handleCancelar}
              disabled={enviando || cita.estado === "COMPLETADA"}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
            >
              {enviando ? "..." : "Cancelar Cita"}
            </button>
            <button
              onClick={handleCompletar}
              disabled={enviando || cita.estado === "COMPLETADA"}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
            >
              {enviando ? "..." : "Completar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
