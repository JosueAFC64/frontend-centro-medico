import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import EmpleadosService from "../apiservice/empleados-service"
import ModalEmpleado from "../components/ModalEmpleado"
import { Users, Search, UserPlus, Eye, Trash2, Briefcase, Stethoscope, Loader2 } from "lucide-react"

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
    if (!especialidades || especialidades.length === 0) return <span className="text-slate-400 italic">Sin especialidades</span>
    return (
      <div className="flex flex-wrap gap-1">
        {especialidades.map((e) => (
          <span key={e.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-100 dark:border-teal-800">
            {e.nombre}
          </span>
        ))}
      </div>
    )
  }

  const cargoLabel = {
    MEDICO: "Médico",
    ENFERMERA: "Enfermera",
    PERSONAL_ADMINISTRATIVO: "Personal Administrativo",
  };

  const cargoColors = {
    MEDICO: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    ENFERMERA: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
    PERSONAL_ADMINISTRATIVO: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <Users className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            Empleados
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 ml-14">Gestione el personal del centro médico</p>
        </div>
        <button
          onClick={handleNuevoEmpleado}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-bold flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <UserPlus size={20} />
          Nuevo Empleado
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Total: <span className="text-slate-900 dark:text-white font-bold">{filtrados.length}</span> empleados
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
            <div className="text-slate-500 font-medium">Cargando empleados...</div>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center p-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No hay empleados encontrados</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              {searchTerm ? "No se encontraron resultados para tu búsqueda." : "Aún no hay empleados registrados en el sistema."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Especialidades</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtrados.map((empleado) => (
                  <tr key={empleado.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold uppercase border border-slate-200 dark:border-slate-700">
                          {empleado.nombreCompleto.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{empleado.nombreCompleto}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{empleado.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cargoColors[empleado.cargo] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {cargoLabel[empleado.cargo] || empleado.cargo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {formatearEspecialidades(empleado.especialidades)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleVer(empleado.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEliminar(empleado.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          title="Eliminar empleado"
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
