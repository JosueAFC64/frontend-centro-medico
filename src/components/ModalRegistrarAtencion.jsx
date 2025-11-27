import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import AtencionesService from "../apiservice/atenciones-service"
import { X, FileText, Activity, Clipboard, Save, Loader2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function ModalRegistrarAtencion({ isOpen, onClose, onSave, idCita, fechaAtencion }) {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    diagnostico: "",
    tratamiento: "",
    observaciones: ""
  })

  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegistrar = async () => {
    if (!formData.diagnostico.trim()) {
      toast.warning("Por favor ingrese el diagnóstico")
      return
    }

    if (!formData.tratamiento.trim()) {
      toast.warning("Por favor ingrese el tratamiento")
      return
    }

    try {
      setEnviando(true)
      await AtencionesService.registrarAtencion({
        idCita,
        fechaAtencion,
        diagnostico: formData.diagnostico.trim(),
        tratamiento: formData.tratamiento.trim(),
        observaciones: formData.observaciones.trim(),
        idMedicoEjecutor: user.id,
      })
      toast.success("Atención registrada exitosamente")
      setFormData({
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
      })
      onSave()
      onClose()
    } catch (error) {
      console.log(formData)
      toast.error(error.message || "Error al registrar atención")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registrar Atención</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Complete los detalles de la consulta</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <FileText size={16} className="text-teal-500" />
              Diagnóstico <span className="text-red-500">*</span>
            </label>
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              disabled={enviando}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none"
              placeholder="Ingrese el diagnóstico detallado..."
              rows="3"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Activity size={16} className="text-teal-500" />
              Tratamiento <span className="text-red-500">*</span>
            </label>
            <textarea
              name="tratamiento"
              value={formData.tratamiento}
              onChange={handleChange}
              disabled={enviando}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none"
              placeholder="Indique el tratamiento a seguir..."
              rows="3"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Clipboard size={16} className="text-teal-500" />
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              disabled={enviando}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none"
              placeholder="Notas adicionales (opcional)..."
              rows="3"
            />
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
                Registrar Atención
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

