import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import horariosService from "../apiservice/horarios-service"
import EmpleadosService from "../apiservice/empleados-service"
import EspecialidadesService from "../apiservice/especialidades-service"
import ConsultoriosService from "../apiservice/consultorios-service"

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in slide-in-from-bottom duration-300">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Nuevo Horario</h2>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        ) : (
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Médico <span className="text-red-500">*</span>
              </label>
              <select
                name="idMedico"
                value={formData.idMedico}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccione un médico</option>
                {medicos.map((medico) => (
                  <option key={medico.idMedico} value={medico.idMedico}>
                    {medico.nombres} {medico.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Consultorio <span className="text-red-500">*</span>
              </label>
              <select
                name="nro_consultorio"
                value={formData.nro_consultorio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccione un consultorio</option>
                {consultorios.map((consultorio) => (
                  <option key={consultorio.nro_consultorio} value={consultorio.nro_consultorio}>
                    Consultorio {consultorio.nro_consultorio} - {consultorio.ubicacion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Especialidad <span className="text-red-500">*</span>
              </label>
              <select
                name="idEspecialidad"
                value={formData.idEspecialidad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((especialidad) => (
                  <option key={especialidad.id} value={especialidad.id}>
                    {especialidad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hora Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hora Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Duración de Slot (minutos) <span className="text-red-500">*</span>
              </label>
              <select
                name="duracionSlotMinutos"
                value={formData.duracionSlotMinutos}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleRegistrar}
                disabled={enviando}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {enviando ? "Registrando..." : "Registrar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
