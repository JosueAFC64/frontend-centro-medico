import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import PacientesService from "../apiservice/pacientes-service"
import HistoriasService from "../apiservice/historias-service"
import ModalPaciente from "../components/ModalPaciente"
import ModalHistoriaMedica from "../components/ModalHistoriaMedica"
import ModalRegistroPaciente from "../components/ModalRegistroPaciente"

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalRegistroOpen, setIsModalRegistroOpen] = useState(false)
  const [isModalHistoriaOpen, setIsModalHistoriaOpen] = useState(false)
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [dniSeleccionado, setDniSeleccionado] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [historiasDisponibles, setHistoriasDisponibles] = useState({})

  useEffect(() => {
    cargarPacientes()
  }, [])

  const cargarPacientes = async () => {
    try {
      setLoading(true)
      const data = await PacientesService.listarPacientes()
      setPacientes(data)
      setFiltrados(data)

      // Verificar quién tiene historia médica
      const historias = {}
      for (const paciente of data) {
        try {
          await HistoriasService.buscarPorDni(paciente.dni)
          historias[paciente.dni] = true
        } catch {
          historias[paciente.dni] = false
        }
      }
      setHistoriasDisponibles(historias)
    } catch (error) {
      toast.error("Error al cargar pacientes")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    const filtered = pacientes.filter((pac) => pac.dni.includes(value))
    setFiltrados(filtered)
  }

  const handleNuevoPaciente = () => {
    setIsModalRegistroOpen(true)
  }

  const handleVer = async (dni) => {
    try {
      setCargandoDetalle(true)
      const data = await PacientesService.buscarPorDni(dni)
      setPacienteSeleccionado(data)
      setIsModalOpen(true)
    } catch (error) {
      toast.error("Error al cargar detalles del paciente")
    } finally {
      setCargandoDetalle(false)
    }
  }

  const handleHistoriaMedica = (dni) => {
    setDniSeleccionado(dni)
    setIsModalHistoriaOpen(true)
  }

  const handleGuardarPaciente = () => {
    cargarPacientes()
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este paciente?")) {
      return
    }

    try {
      await PacientesService.eliminarPaciente(id)
      toast.success("Paciente eliminado exitosamente")
      cargarPacientes()
    } catch (error) {
      toast.error("Error al eliminar el paciente")
    }
  }

  const formatearNombre = (paciente) => {
    return `${paciente.nombres} ${paciente.apellidos}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pacientes</h1>
        <p className="text-muted-foreground">Gestione los pacientes del centro médico</p>
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
              placeholder="Buscar por DNI..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          onClick={handleNuevoPaciente}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
        >
          + Nuevo Paciente
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-muted-foreground">No hay pacientes registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Apellido</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">DNI</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Historia Médica</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtrados.map((paciente) => (
                <tr key={paciente.idPaciente} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{paciente.nombres}</td>
                  <td className="px-6 py-4 text-foreground">{paciente.apellidos}</td>
                  <td className="px-6 py-4 text-foreground">{paciente.dni}</td>
                  <td className="px-6 py-4">
                    {historiasDisponibles[paciente.dni] ? (
                      <button
                        onClick={() => handleHistoriaMedica(paciente.dni)}
                        className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors font-medium"
                      >
                        Ver Historia
                      </button>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin historia médica</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleVer(paciente.dni)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEliminar(paciente.idPaciente)}
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

      <ModalPaciente
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setPacienteSeleccionado(null)
        }}
        onSave={handleGuardarPaciente}
        paciente={pacienteSeleccionado}
        isLoading={cargandoDetalle}
      />

      <ModalHistoriaMedica
        isOpen={isModalHistoriaOpen}
        onClose={() => {
          setIsModalHistoriaOpen(false)
          setDniSeleccionado(null)
        }}
        dni={dniSeleccionado}
      />

      <ModalRegistroPaciente
        isOpen={isModalRegistroOpen}
        onClose={() => setIsModalRegistroOpen(false)}
        onSave={() => {
          cargarPacientes()
        }}
      />
    </div>
  )
}
