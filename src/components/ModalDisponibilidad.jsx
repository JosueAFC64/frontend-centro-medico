import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import disponibilidadesService from "../apiservice/disponibilidades-service"
import EmpleadosService from "../apiservice/empleados-service"
import EspecialidadesService from "../apiservice/especialidades-service"
import { X, Save, Loader2, CalendarPlus, User, Stethoscope, Calendar, Clock } from "lucide-react"

export default function ModalDisponibilidad({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    idMedico: "",
    idEspecialidad: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  })

  const [medicos, setMedicos] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (isOpen) {
      cargarDatos()
    }
  }, [isOpen])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [medicosData, especialidadesData] = await Promise.all([
        EmpleadosService.listarMedicos(),
        EspecialidadesService.listarEspecialidades(),
      ])
      setMedicos(medicosData)
      setEspecialidades(especialidadesData)
    } catch (error) {
      toast.error("Error al cargar datos")
    } finally {
      setCargando(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegistrar = async () => {
    if (
      !formData.idMedico ||
      !formData.idEspecialidad ||
      !formData.fecha ||
      !formData.hora_inicio ||
      !formData.hora_fin
    ) {
      toast.warning("Por favor complete todos los campos")
      console.log(formData)
      return
    }

    try {
      setEnviando(true)
      await disponibilidadesService.registrarDisponibilidad(formData)
      toast.success("Disponibilidad registrada exitosamente")
      setFormData({
        idMedico: "",
        idEspecialidad: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
      })
      onSave()
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al registrar disponibilidad")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full flex flex-col animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-teal-500" />
              Nueva Disponibilidad
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Asigne un horario a un médico
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {cargando ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
            <div className="text-slate-500 font-medium">Cargando datos...</div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Médico <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  name="idMedico"
                  value={formData.idMedico}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none"
                >
                  <option value="">Seleccione un médico</option>
                  {medicos.map((medico) => (
                    <option key={medico.idMedico} value={medico.idMedico}>
                      {medico.nombres} {medico.apellidos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Especialidad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  name="idEspecialidad"
                  value={formData.idEspecialidad}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none"
                >
                  <option value="">Seleccione una especialidad</option>
                  {especialidades.map((especialidad) => (
                    <option key={especialidad.id} value={especialidad.id}>
                      {especialidad.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Fecha <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Hora Inicio <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="time"
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Hora Fin <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="time"
                    name="hora_fin"
                    value={formData.hora_fin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleRegistrar}
                disabled={enviando}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
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
        )}
      </div>
    </div>
  )
}
