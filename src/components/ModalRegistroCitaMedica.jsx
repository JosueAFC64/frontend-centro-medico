import { useState } from "react"
import { toast } from "react-toastify"
import citasMedicasService from "../apiservice/citasmedicas-service"
import { X, CreditCard, User, Save, Loader2 } from "lucide-react"

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registrar Cita</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Ingrese los datos del paciente</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <User size={16} className="text-teal-500" />
              DNI del Paciente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ingrese el DNI"
              value={dniPaciente}
              onChange={(e) => setDniPaciente(e.target.value)}
              disabled={enviando}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <CreditCard size={16} className="text-teal-500" />
              Método de Pago <span className="text-red-500">*</span>
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              disabled={enviando}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
              <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
              <option value="TRANSFERENCIA">Transferencia Bancaria</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            disabled={enviando}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegistrar}
            disabled={enviando}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
          >
            {enviando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Save size={18} />
                Registrar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
