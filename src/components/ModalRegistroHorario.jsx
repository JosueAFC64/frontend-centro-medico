import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import horariosService from "../apiservice/horarios-service"
import EmpleadosService from "../apiservice/empleados-service"
import EspecialidadesService from "../apiservice/especialidades-service"
import ConsultoriosService from "../apiservice/consultorios-service"
import { X, Calendar, Clock, User, Stethoscope, MapPin, Save, Loader2 } from "lucide-react"

export default function ModalRegistroHorario({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    idMedico: "",
    nro_consultorio: "",
    idEspecialidad: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    duracionSlotMinutos: 30,
  })

  const [medicos, setMedicos] = useState([])
  const [consultorios, setConsultorios] = useState([])
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
      const [medicosData, consultoriosData, especialidadesData] = await Promise.all([
        EmpleadosService.listarMedicos(),
        ConsultoriosService.listarConsultorios(),
        EspecialidadesService.listarEspecialidades(),
      ])
      setMedicos(medicosData)
      setConsultorios(consultoriosData)
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

  const formatHora = (hora) => {
    const [h, m, s] = hora.split(":");
    const hh = h.padStart(2, "0");
    const mm = m.padStart(2, "0");
    const ss = s ? s.padStart(2, "0") : "00";
    return `${hh}:${mm}:${ss}`;
  };


  const handleRegistrar = async () => {
    if (
      !formData.idMedico ||
      !formData.nro_consultorio ||
      !formData.idEspecialidad ||
      !formData.fecha ||
      !formData.horaInicio ||
      !formData.horaFin ||
      !formData.duracionSlotMinutos
    ) {
      console.log(formData)
      toast.warning("Por favor complete todos los campos")
      return
    }

    if (formData.horaInicio >= formData.horaFin) {
      toast.warning("La hora de inicio debe ser menor a la hora de fin")
      return
    }

    try {
      setEnviando(true)
      const payload = {
        idEmpleado: Number.parseInt(formData.idMedico),
        nro_consultorio: formData.nro_consultorio,
        idEspecialidad: Number.parseInt(formData.idEspecialidad),
        fecha: formData.fecha,
        horaInicio: formatHora(formData.horaInicio),
        horaFin: formatHora(formData.horaFin),
        duracionSlotMinutos: Number.parseInt(formData.duracionSlotMinutos),
      }
      await horariosService.registrarHorario(payload)
      toast.success("Horario registrado exitosamente")
      setFormData({
        idMedico: "",
        nro_consultorio: "",
        idEspecialidad: "",
        fecha: "",
        horaInicio: "",
        horaFin: "",
        duracionSlotMinutos: 30,
      })
      onSave()
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al registrar horario")
      console.log(formData)
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nuevo Horario</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Complete los datos para registrar un horario</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {cargando ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-2" />
            <p className="text-slate-500 text-sm">Cargando datos...</p>
          </div>
        ) : (
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <User size={16} className="text-teal-500" />
                Médico <span className="text-red-500">*</span>
              </label>
              <select
                name="idMedico"
                value={formData.idMedico}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
              >
                <option value="">Seleccione un médico</option>
                {medicos.map((medico) => (
                  <option key={medico.id} value={medico.id}>
                    {medico.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <MapPin size={16} className="text-teal-500" />
                  Consultorio <span className="text-red-500">*</span>
                </label>
                <select
                  name="nro_consultorio"
                  value={formData.nro_consultorio}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                >
                  <option value="">Seleccione...</option>
                  {consultorios.map((consultorio) => (
                    <option key={consultorio.nro_consultorio} value={consultorio.nro_consultorio}>
                      {consultorio.nro_consultorio} - {consultorio.ubicacion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Stethoscope size={16} className="text-teal-500" />
                  Especialidad <span className="text-red-500">*</span>
                </label>
                <select
                  name="idEspecialidad"
                  value={formData.idEspecialidad}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                >
                  <option value="">Seleccione...</option>
                  {especialidades.map((especialidad) => (
                    <option key={especialidad.id} value={especialidad.id}>
                      {especialidad.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Calendar size={16} className="text-teal-500" />
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Clock size={16} className="text-teal-500" />
                  Hora Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Clock size={16} className="text-teal-500" />
                  Hora Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Clock size={16} className="text-teal-500" />
                Duración de Slot (minutos) <span className="text-red-500">*</span>
              </label>
              <select
                name="duracionSlotMinutos"
                value={formData.duracionSlotMinutos}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex gap-3">
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
                Registrar Horario
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
