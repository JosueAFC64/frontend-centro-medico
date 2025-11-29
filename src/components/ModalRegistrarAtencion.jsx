import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import AtencionesService from "../apiservice/atenciones-service"
import RecetaMedicaService from "../apiservice/recetamedica-service"
import AnalisisClinicoService from "../apiservice/analisisclinico-service"
import ModalRegistrarReceta from "./ModalRegistrarReceta"
import ModalRegistrarAnalisis from "./ModalRegistrarAnalisis"
import { X, FileText, Activity, Clipboard, Save, Loader2, Pill, FlaskConical } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function ModalRegistrarAtencion({ isOpen, onClose, onSave, idCita, fechaAtencion, dniPaciente }) {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    diagnostico: "",
    tratamiento: "",
    observaciones: ""
  })

  const [enviando, setEnviando] = useState(false)
  const [recetaData, setRecetaData] = useState(null)
  const [analisisData, setAnalisisData] = useState(null)
  const [isModalRecetaOpen, setIsModalRecetaOpen] = useState(false)
  const [isModalAnalisisOpen, setIsModalAnalisisOpen] = useState(false)

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
      
      // 1. Registrar la atención médica
      const atencionResponse = await AtencionesService.registrarAtencion({
        idCita,
        fechaAtencion,
        diagnostico: formData.diagnostico.trim(),
        tratamiento: formData.tratamiento.trim(),
        observaciones: formData.observaciones.trim(),
        idMedicoEjecutor: user.id,
      })
      
      const idAtencion = atencionResponse.id || atencionResponse.data?.id
      
      if (!idAtencion) {
        throw new Error("No se pudo obtener el ID de la atención registrada")
      }

      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      // 2. Registrar receta médica si existe
      if (recetaData) {
        try {
          await RecetaMedicaService.registrarReceta({
            ...recetaData,
            idAtencion: idAtencion,
          })
          await delay(1000)
        } catch (recetaError) {
          console.error("Error al registrar receta:", recetaError)
          toast.error("La atención se registró pero hubo un error al registrar la receta médica")
        }
      }

      // 3. Registrar análisis clínico si existe
      if (analisisData) {
        try {
          await AnalisisClinicoService.registrarAnalisis({
            ...analisisData,
            idAtencion: idAtencion,
          })
        } catch (analisisError) {
          console.error("Error al registrar análisis:", analisisError)
          toast.error("La atención se registró pero hubo un error al registrar el análisis clínico")
        }
      }

      toast.success("Atención registrada exitosamente")
      setFormData({
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
      })
      setRecetaData(null)
      setAnalisisData(null)
      onSave()
      onClose()
    } catch (error) {
      console.log(formData)
      toast.error(error.message || "Error al registrar atención")
    } finally {
      setEnviando(false)
    }
  }

  const handleGuardarReceta = (data) => {
    setRecetaData(data)
    toast.success("Receta médica guardada. Se registrará al confirmar la atención.")
  }

  const handleGuardarAnalisis = (data) => {
    setAnalisisData(data)
    toast.success("Análisis clínico guardado. Se registrará al confirmar la atención.")
  }

  // Resetear estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setRecetaData(null)
      setAnalisisData(null)
      setIsModalRecetaOpen(false)
      setIsModalAnalisisOpen(false)
    }
  }, [isOpen])

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

          {/* Botones para abrir modales de Receta y Análisis */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsModalRecetaOpen(true)}
                disabled={enviando}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Pill size={18} />
                {recetaData ? "Editar Receta" : "Agregar Receta"}
              </button>
              <button
                type="button"
                onClick={() => setIsModalAnalisisOpen(true)}
                disabled={enviando}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FlaskConical size={18} />
                {analisisData ? "Editar Análisis" : "Agregar Análisis"}
              </button>
            </div>
            {(recetaData || analisisData) && (
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                {recetaData && (
                  <div className="flex items-center gap-2">
                    <Pill size={14} className="text-teal-500" />
                    <span>Receta médica preparada ({recetaData.detalles?.length || 0} medicamento(s))</span>
                  </div>
                )}
                {analisisData && (
                  <div className="flex items-center gap-2">
                    <FlaskConical size={14} className="text-teal-500" />
                    <span>Análisis clínico preparado ({analisisData.tipoAnalisisIds?.length || 0} tipo(s))</span>
                  </div>
                )}
              </div>
            )}
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

      {/* Modales de Receta y Análisis */}
      <ModalRegistrarReceta
        isOpen={isModalRecetaOpen}
        onClose={() => setIsModalRecetaOpen(false)}
        onSave={handleGuardarReceta}
        idMedico={user?.id}
        dniPaciente={dniPaciente}
        fechaSolicitud={fechaAtencion}
        recetaDataInicial={recetaData}
      />

      <ModalRegistrarAnalisis
        isOpen={isModalAnalisisOpen}
        onClose={() => setIsModalAnalisisOpen(false)}
        onSave={handleGuardarAnalisis}
        idMedico={user?.id}
        dniPaciente={dniPaciente}
        fechaSolicitud={fechaAtencion}
        analisisDataInicial={analisisData}
      />
    </div>
  )
}

