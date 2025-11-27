import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import PacientesService from "../apiservice/pacientes-service"
import HistoriasService from "../apiservice/historias-service"
import ModalPaciente from "../components/ModalPaciente"
import ModalHistoriaMedica from "../components/ModalHistoriaMedica"
import ModalRegistroPaciente from "../components/ModalRegistroPaciente"
import { Users, Search, Plus, FileText, Eye, Trash2, Loader2, User } from "lucide-react"

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <Users className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            Pacientes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 ml-14">Gestione los pacientes del centro médico</p>
        </div>
        <button
          onClick={handleNuevoPaciente}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-bold flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Nuevo Paciente
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por DNI..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Total: <span className="text-slate-900 dark:text-white font-bold">{filtrados.length}</span> pacientes
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
            <div className="text-slate-500 font-medium">Cargando pacientes...</div>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center p-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No hay pacientes encontrados</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              {searchTerm ? "No se encontraron resultados para tu búsqueda." : "Aún no hay pacientes registrados en el sistema."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DNI</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Historia Médica</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtrados.map((paciente) => (
                  <tr key={paciente.idPaciente} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm">
                          {paciente.nombres.charAt(0)}{paciente.apellidos.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{paciente.nombres} {paciente.apellidos}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">
                        {paciente.dni}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {historiasDisponibles[paciente.dni] ? (
                        <button
                          onClick={() => handleHistoriaMedica(paciente.dni)}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1.5 w-fit"
                        >
                          <FileText size={14} />
                          Ver Historia
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 italic flex items-center gap-1.5">
                          <FileText size={14} />
                          Sin historia
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleVer(paciente.dni)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEliminar(paciente.idPaciente)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          title="Eliminar paciente"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
