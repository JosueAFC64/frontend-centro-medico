import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import HistoriasService from "../apiservice/historias-service"
import ModalSeccionAtencion from "../components/ModalSeccionAtencion"
import { X, Save, Loader2, FileText } from "lucide-react"

export default function ModalHistoriaMedica({ isOpen, onClose, dni, isLoading }) {
  const [formData, setFormData] = useState({
    peso: "",
    talla: "",
    tipoSangre: "",
    alergias: "",
    antecedentesFamiliares: "",
    antecedentesPersonales: "",
  })

  const [historiaMedica, setHistoriaMedica] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [paginaActual, setPaginaActual] = useState(0)

  useEffect(() => {
    if (isOpen && dni) {
      cargarHistoriaMedica()
    }
  }, [isOpen, dni])

  const cargarHistoriaMedica = async () => {
    try {
      const data = await HistoriasService.buscarPorDni(dni)
      setHistoriaMedica(data)
      setFormData({
        peso: data.peso || "",
        talla: data.talla || "",
        tipoSangre: data.tipoSangre || "",
        alergias: data.alergias || "",
        antecedentesFamiliares: data.antecedentesFamiliares || "",
        antecedentesPersonales: data.antecedentesPersonales || "",
      })
    } catch (error) {
      toast.error("No se encontró historia médica")
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setEnviando(true)
      await HistoriasService.actualizarHistoriaMedica(dni, {
        dniPaciente: dni,
        ...formData,
      })
      toast.success("Historia médica actualizada exitosamente")
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al guardar la historia médica")
    } finally {
      setEnviando(false)
    }
  }

  const formatearFecha = (fecha) => {
    const partes = fecha.split("-");
    const date = new Date(partes[0], partes[1] - 1, partes[2]); // año, mesIndex, día
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null

  const atenciones = historiaMedica?.atenciones || []
  const atencionActual = atenciones[paginaActual]

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-500" />
              Historia Médica
            </h2>
            {historiaMedica?.paciente && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">{historiaMedica.paciente.nombres} {historiaMedica.paciente.apellidos}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>Creado: {formatearFecha(historiaMedica.fechaCreacion)}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
            <div className="text-slate-500 font-medium">Cargando historia médica...</div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Datos Biométricos</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Peso (kg)</label>
                    <input
                      type="number"
                      name="peso"
                      value={formData.peso}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                      placeholder="0.0"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Talla (cm)</label>
                    <input
                      type="number"
                      name="talla"
                      value={formData.talla}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tipo de Sangre</label>
                    <select
                      name="tipoSangre"
                      value={formData.tipoSangre}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none"
                    >
                      <option value="">Seleccione...</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Edad</label>
                    <input
                      type="number"
                      value={historiaMedica?.edad || ""}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Antecedentes</h3>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Alergias</label>
                  <textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none text-sm"
                    placeholder="Ninguna registrada"
                    rows="2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Antecedentes Familiares</label>
                  <textarea
                    name="antecedentesFamiliares"
                    value={formData.antecedentesFamiliares}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none text-sm"
                    placeholder="Ninguno registrado"
                    rows="2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Antecedentes Personales</label>
                  <textarea
                    name="antecedentesPersonales"
                    value={formData.antecedentesPersonales}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none text-sm"
                    placeholder="Ninguno registrado"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            <ModalSeccionAtencion
              atencionActual={atencionActual}
              atenciones={atenciones}
              paginaActual={paginaActual}
              setPaginaActual={setPaginaActual}
              formatearFecha={formatearFecha}
            />
          </div>
        )}

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            Volver
          </button>
          <button
            onClick={handleSave}
            disabled={enviando}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
          >
            {enviando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Historia
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
