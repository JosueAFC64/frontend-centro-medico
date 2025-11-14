import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import EmpleadosService from "../apiservice/empleados-service"
import ModalEmpleado from "../components/ModalEmpleado"

export default function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("registrar") // 'registrar' o 'editar'
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  useEffect(() => {
    cargarEmpleados()
  }, [])

  const cargarEmpleados = async () => {
    try {
      setLoading(true)
      const data = await EmpleadosService.listarEmpleados()
      setEmpleados(data)
      setFiltrados(data)
    } catch (error) {
      toast.error("Error al cargar empleados")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    const filtered = empleados.filter((emp) => emp.nombreCompleto.toLowerCase().includes(value.toLowerCase()))
    setFiltrados(filtered)
  }

  const handleNuevoEmpleado = () => {
    setModalMode("registrar")
    setEmpleadoSeleccionado(null)
    setIsModalOpen(true)
  }

  const handleVer = async (id) => {
    try {
      setCargandoDetalle(true)
      const data = await EmpleadosService.buscarPorId(id)
      setEmpleadoSeleccionado(data)
      setModalMode("editar")
      setIsModalOpen(true)
    } catch (error) {
      toast.error("Error al cargar detalles del empleado")
    } finally {
      setCargandoDetalle(false)
    }
  }

  const handleGuardarEmpleado = async (formData) => {
    try {
      if (modalMode === "registrar") {
        const dataEnvio = {
          ...formData,
          fechaIngreso: new Date().toISOString(),
          activo: true,
        }
        await EmpleadosService.registrarEmpleado(dataEnvio)
        toast.success("Empleado registrado exitosamente")
      } else {
        const dataEnvio = {
          ...formData,
          activo: empleadoSeleccionado.activo,
          fechaIngreso: empleadoSeleccionado.fechaIngreso,
        }
        await EmpleadosService.actualizarEmpleado(empleadoSeleccionado.id, dataEnvio)
        toast.success("Empleado actualizado exitosamente")
      }
      setIsModalOpen(false)
      cargarEmpleados()
    } catch (error) {
      toast.error(error.message || "Error al guardar el empleado")
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este empleado?")) {
      return
    }

    try {
      await EmpleadosService.eliminarEmpleado(id)
      toast.success("Empleado eliminado exitosamente")
      cargarEmpleados()
    } catch (error) {
      toast.error("Error al eliminar el empleado")
    }
  }

  const formatearEspecialidades = (especialidades) => {
    if (!especialidades || especialidades.length === 0) return "Sin especialidades"
    return especialidades.map((e) => e.nombre).join(", ")
  }

  const cargoLabel = {
    MEDICO: "Médico",
    ENFERMERA: "Enfermera",
    PERSONAL_ADMINISTRATIVO: "Personal Administrativo",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Empleados</h1>
        <p className="text-muted-foreground">Gestione el personal del centro médico</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          onClick={handleNuevoEmpleado}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
        >
          + Nuevo Empleado
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-muted-foreground">No hay empleados registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Cargo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Especialidades</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtrados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{empleado.nombreCompleto}</td>
                  <td className="px-6 py-4 text-foreground">{cargoLabel[empleado.cargo] || empleado.cargo}</td>
                  <td className="px-6 py-4 text-foreground text-sm">
                    {formatearEspecialidades(empleado.especialidades)}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleVer(empleado.id)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEliminar(empleado.id)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalEmpleado
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEmpleadoSeleccionado(null)
        }}
        onSave={handleGuardarEmpleado}
        empleado={modalMode === "editar" ? empleadoSeleccionado : null}
        isLoading={cargandoDetalle}
      />
    </div>
  )
}
