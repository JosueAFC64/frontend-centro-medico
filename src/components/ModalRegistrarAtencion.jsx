import { useState } from "react"
import { toast } from "react-toastify"
import AtencionesService from "../apiservice/atenciones-service"

export default function ModalRegistrarAtencion({ isOpen, onClose, onSave, idCita }) {
  const [formData, setFormData] = useState({
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
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
        diagnostico: formData.diagnostico.trim(),
        tratamiento: formData.tratamiento.trim(),
        observaciones: formData.observaciones.trim(),
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
      toast.error(error.message || "Error al registrar atención")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in slide-in-from-bottom duration-300">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Registrar Atención</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Diagnóstico <span className="text-red-500">*</span>
            </label>
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              disabled={enviando}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="Ingrese el diagnóstico"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tratamiento <span className="text-red-500">*</span>
            </label>
            <textarea
              name="tratamiento"
              value={formData.tratamiento}
              onChange={handleChange}
              disabled={enviando}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="Ingrese el tratamiento"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              disabled={enviando}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="Ingrese las observaciones"
              rows="3"
            />
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
              onClick={handleRegistrar}
              disabled={enviando}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
            >
              {enviando ? "Registrando..." : "Registrar Atención"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

