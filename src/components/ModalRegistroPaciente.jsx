import { useState } from "react"
import { toast } from "react-toastify"
import PacientesService from "../apiservice/pacientes-service"
import HistoriasService from "../apiservice/historias-service"
import { X, Save, Loader2, UserPlus, User, Phone, Mail, Calendar, MapPin, AlertCircle, FileText, Activity } from "lucide-react"

export default function ModalRegistroPaciente({ isOpen, onClose, onSave }) {
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
    peso: "",
    talla: "",
    tipoSangre: "",
    alergias: "",
    antecedentesFamiliares: "",
    antecedentesPersonales: "",
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
    // Validar campos requeridos
    if (
      !formData.nombres.trim() ||
      !formData.apellidos.trim() ||
      !formData.dni.trim() ||
      !formData.peso ||
      !formData.talla ||
      !formData.tipoSangre
    ) {
      toast.warning("Por favor complete los campos requeridos")
      return
    }

    try {
      setEnviando(true)

      // Registrar paciente
      const dataPaciente = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        telefono: formData.telefono,
        correo: formData.correo,
        fechaNacimiento: formData.fechaNacimiento,
        telefonoEmergencia: formData.telefonoEmergencia,
        contactoEmergencia: formData.contactoEmergencia,
        direccion: formData.direccion,
      }

      const pacienteRegistrado = await PacientesService.registrarPaciente(dataPaciente)
      toast.success("Paciente registrado exitosamente")

      // Registrar historia médica
      const dataHistoria = {
        dniPaciente: formData.dni,
        peso: formData.peso,
        talla: formData.talla,
        tipoSangre: formData.tipoSangre,
        alergias: formData.alergias,
        antecedentesFamiliares: formData.antecedentesFamiliares,
        antecedentesPersonales: formData.antecedentesPersonales,
      }

      await HistoriasService.registrarHistoriaMedica(dataHistoria)
      toast.success("Historia médica registrada exitosamente")

      onSave()
      onClose()
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
        peso: "",
        talla: "",
        tipoSangre: "",
        alergias: "",
        antecedentesFamiliares: "",
        antecedentesPersonales: "",
      })
    } catch (error) {
      toast.error(error.message || "Error al registrar paciente y su historia médica")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-500" />
              Registrar Nuevo Paciente
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ingrese los datos personales y la historia médica inicial
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-8">
            {/* Sección Datos Personales */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-500" />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
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
                <div className="md:col-span-3 space-y-1.5">
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

              <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Datos de Emergencia
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Contacto</label>
                    <input
                      type="text"
                      name="contactoEmergencia"
                      value={formData.contactoEmergencia}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="Nombre de contacto"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="telefonoEmergencia"
                        value={formData.telefonoEmergencia}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-slate-400"
                        placeholder="Teléfono de emergencia"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección Historia Médica */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-500" />
                Historia Médica Inicial
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Peso (kg) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                    placeholder="0.0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Talla (cm) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="talla"
                    value={formData.talla}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:text-slate-400"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Tipo de Sangre <span className="text-rose-500">*</span>
                  </label>
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
                <div className="md:col-span-3 space-y-1.5">
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
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Antecedentes Familiares</label>
                    <textarea
                      name="antecedentesFamiliares"
                      value={formData.antecedentesFamiliares}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none text-sm"
                      placeholder="Ninguno registrado"
                      rows="3"
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
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
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
                Registrar Paciente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
