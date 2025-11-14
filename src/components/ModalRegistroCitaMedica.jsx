import { useState } from "react"
import { toast } from "react-toastify"
import citasMedicasService from "../apiservice/citasmedicas-service"

export default function ModalRegistroCitaMedica({ isOpen, onClose, onSave, horarioId, detalleId }) {
  const [dniPaciente, setDniPaciente] = useState("")
  const [metodoPago, setMetodoPago] = useState("EFECTIVO")
  const [enviando, setEnviando] = useState(false)

  const handleRegistrar = async () => {
    if (!dniPaciente.trim()) {
      toast.warning("Por favor ingrese el DNI del paciente")
      return
    }

    if (!metodoPago) {
      toast.warning("Por favor seleccione un método de pago")
      return
    }

    try {
      setEnviando(true)
      await citasMedicasService.registrarCitaMedica({
        dniPaciente: dniPaciente.trim(),
        idHorario: horarioId,
        idDetalleHorario: detalleId,
        metodoPago,
      })
      toast.success("Cita médica registrada exitosamente")
      setDniPaciente("")
      setMetodoPago("EFECTIVO")
      onSave()
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al registrar cita médica")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in slide-in-from-bottom duration-300">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Registrar Cita Médica</h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              DNI del Paciente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ingrese el DNI"
              value={dniPaciente}
              onChange={(e) => setDniPaciente(e.target.value)}
              disabled={enviando}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>

          <div className="border-t border-border pt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Método de Pago <span className="text-red-500">*</span>
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              disabled={enviando}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
              <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
              <option value="TRANSFERENCIA">Transferencia Bancaria</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={enviando}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleRegistrar}
              disabled={enviando}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
            >
              {enviando ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
