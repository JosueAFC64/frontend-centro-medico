import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import disponibilidadesService from "../apiservice/disponibilidades-service"
import EmpleadosService from "../apiservice/empleados-service"
import EspecialidadesService from "../apiservice/especialidades-service"

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in slide-in-from-bottom duration-300">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Nueva Disponibilidad</h2>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
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
                  name="hora_inicio"
                  value={formData.hora_inicio}
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
                  name="hora_fin"
                  value={formData.hora_fin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
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
