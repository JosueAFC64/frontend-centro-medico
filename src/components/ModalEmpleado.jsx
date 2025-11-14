import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import EspecialidadesService from "../apiservice/especialidades-service"
import Modal from "./Modal"

export default function ModalEmpleado({ isOpen, onClose, onSave, empleado = null, isLoading = false }) {
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState([])
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cargo: "",
    dni: "",
    telefono: "",
    correo: "",
    especialidadesIds: [],
  })
  const [cargandoEspecialidades, setCargandoEspecialidades] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (isOpen) {
      cargarEspecialidades()
      if (empleado) {
        setFormData({
          nombres: empleado.nombres || "",
          apellidos: empleado.apellidos || "",
          cargo: empleado.cargo || "",
          dni: empleado.dni || "",
          telefono: empleado.telefono || "",
          correo: empleado.correo || "",
          especialidadesIds: empleado.especialidades?.map((e) => e.id) || [],
        })
      } else {
        setFormData({
          nombres: "",
          apellidos: "",
          cargo: "",
          dni: "",
          telefono: "",
          correo: "",
          especialidadesIds: [],
        })
      }
    }
  }, [isOpen, empleado])

  const cargarEspecialidades = async () => {
    try {
      setCargandoEspecialidades(true)
      const data = await EspecialidadesService.listarEspecialidades()
      console.log(data)
      setEspecialidadesDisponibles(data)
    } catch (error) {
      toast.error("Error al cargar especialidades")
    } finally {
      setCargandoEspecialidades(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const agregarEspecialidad = (especialidadId) => {
    if (!formData.especialidadesIds.includes(especialidadId)) {
      setFormData((prev) => ({
        ...prev,
        especialidadesIds: [...prev.especialidadesIds, especialidadId],
      }))
    }
  }

  const quitarEspecialidad = (especialidadId) => {
    setFormData((prev) => ({
      ...prev,
      especialidadesIds: prev.especialidadesIds.filter((id) => id !== especialidadId),
    }))
  }

  const obtenerNombreEspecialidad = (id) => {
    return especialidadesDisponibles.find((e) => e.id === id)?.nombre || ""
  }

  const handleGuardar = async () => {
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.cargo.trim()) {
      toast.warning("Por favor complete los campos requeridos")
      return
    }

    try {
      setEnviando(true)
      await onSave(formData)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={empleado ? "Ver/Editar Empleado" : "Nuevo Empleado"}>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              placeholder="Nombres"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              placeholder="Apellidos"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Cargo</label>
          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="">Selecciona un cargo</option>
            <option value="MEDICO">Médico</option>
            <option value="ENFERMERA">Enfermera</option>
            <option value="PERSONAL_ADMINISTRATIVO">Personal Administrativo</option>
          </select>
        </div>

        {/* DNI y Teléfono */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              placeholder="DNI"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            placeholder="Correo"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Especialidades */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Especialidades</label>

          {/* Especialidades seleccionadas */}
          {formData.especialidadesIds.length > 0 && (
            <div className="mb-3 p-2 bg-accent rounded-lg">
              <div className="flex flex-wrap gap-2">
                {formData.especialidadesIds.map((id) => (
                  <div
                    key={id}
                    className="inline-flex items-center gap-1 bg-primary text-white px-2 py-1 rounded text-sm"
                  >
                    <span>{obtenerNombreEspecialidad(id)}</span>
                    <span className="hidden">{id}</span>
                    <button
                      type="button"
                      onClick={() => quitarEspecialidad(id)}
                      className="ml-1 hover:text-red-200 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Combo box de especialidades */}
          {cargandoEspecialidades ? (
            <div className="text-sm text-muted-foreground">Cargando especialidades...</div>
          ) : (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  agregarEspecialidad(Number.parseInt(e.target.value))
                  e.target.value = ""
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Seleccionar especialidad</option>
              {especialidadesDisponibles
                .filter((e) => !formData.especialidadesIds.includes(e.id))
                .map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-border">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={enviando || isLoading}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {enviando || isLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </Modal>
  )
}
