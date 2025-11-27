import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import PacientesService from "../apiservice/pacientes-service"
import { X, Save, Loader2, User, Phone, Mail, Calendar, MapPin, AlertCircle } from "lucide-react"

export default function ModalPaciente({ isOpen, onClose, onSave, paciente, isLoading }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    correo: "",
    fechaNacimiento: "",
    telefonoEmergencia: "",
    contactoEmergencia: "",
    direccion: "",
  })

  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (paciente) {
      setFormData(paciente)
    } else {
      setFormData({
        nombres: "",
        apellidos: "",
        dni: "",
        telefono: "",
        correo: "",
        fechaNacimiento: "",
        telefonoEmergencia: "",
        contactoEmergencia: "",
        direccion: "",
      })
    }
  }, [paciente, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.dni.trim()) {
      toast.warning("Por favor complete los campos requeridos")
      return
    }

    try {
      setEnviando(true)
      if (paciente) {
        await PacientesService.actualizarPaciente(paciente.idPaciente, formData)
        toast.success("Paciente actualizado exitosamente")
      }
      onSave(formData)
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al guardar el paciente")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-teal-500" />
              {paciente ? "Editar Paciente" : "Nuevo Paciente"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {paciente ? "Actualice la información del paciente" : "Ingrese los datos del nuevo paciente"}
            </p>
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
            <div className="text-slate-500 font-medium">Cargando datos...</div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Nombres <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                  placeholder="Ingrese nombres"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Apellidos <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                  placeholder="Ingrese apellidos"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  DNI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  disabled={!!paciente}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ingrese DNI"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                    placeholder="Ingrese teléfono"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Correo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                    placeholder="Ingrese correo"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Fecha de Nacimiento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  Datos de Emergencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Contacto de Emergencia</label>
                    <input
                      type="text"
                      name="contactoEmergencia"
                      value={formData.contactoEmergencia}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="Nombre de contacto"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Teléfono de Emergencia</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="telefonoEmergencia"
                        value={formData.telefonoEmergencia}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                        placeholder="Ingrese teléfono de emergencia"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                    placeholder="Ingrese dirección completa"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={enviando}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
          >
            {enviando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Paciente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
