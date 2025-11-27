import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import EspecialidadesService from "../apiservice/especialidades-service"
import Modal from "../components/Modal"
import { Stethoscope, Search, Plus, Trash2, DollarSign, Loader2, AlertCircle } from "lucide-react"

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nombreEspecialidad, setNombreEspecialidad] = useState("")
  const [costoEspecialidad, setCostoEspecialidad] = useState("")
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    cargarEspecialidades()
  }, [])

  const cargarEspecialidades = async () => {
    try {
      setLoading(true)
      const data = await EspecialidadesService.listarEspecialidades()
      setEspecialidades(data)
      setFiltrados(data)
    } catch (error) {
      toast.error("Error al cargar especialidades")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    const filtered = especialidades.filter((esp) => esp.nombre.toLowerCase().includes(value.toLowerCase()))
    setFiltrados(filtered)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar esta especialidad?")) {
      return
    }

    try {
      await EspecialidadesService.eliminarEspecialidad(id)
      toast.success("Especialidad eliminada exitosamente")
      cargarEspecialidades()
    } catch (error) {
      toast.error("Error al eliminar la especialidad")
    }
  }

  const handleRegistrar = async () => {
    if (!nombreEspecialidad.trim()) {
      toast.warning("Por favor ingrese el nombre de la especialidad")
      return
    }

    try {
      setEnviando(true)
      await EspecialidadesService.registrarEspecialidad(nombreEspecialidad, costoEspecialidad)
      toast.success("Especialidad registrada exitosamente")
      setNombreEspecialidad("")
      setCostoEspecialidad("")
      setIsModalOpen(false)
      cargarEspecialidades()
    } catch (error) {
      toast.error("Error al registrar la especialidad")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <Stethoscope className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            Especialidades
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 ml-14">Gestione las especialidades médicas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-bold flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Nueva Especialidad
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Total: <span className="text-slate-900 dark:text-white font-bold">{filtrados.length}</span> especialidades
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
            <div className="text-slate-500 font-medium">Cargando especialidades...</div>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center p-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
              <Stethoscope className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No hay especialidades encontradas</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              {searchTerm ? "No se encontraron resultados para tu búsqueda." : "Aún no hay especialidades registradas en el sistema."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Costo Cita Médica</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtrados.map((especialidad) => (
                  <tr key={especialidad.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
                          <Stethoscope size={20} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{especialidad.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                        <DollarSign size={16} className="text-slate-400" />
                        S/. {especialidad.costo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEliminar(especialidad.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar especialidad"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setNombreEspecialidad("")
          setCostoEspecialidad("")
        }}
        title="Nueva Especialidad"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Ej. Cardiología, Pediatría"
                value={nombreEspecialidad}
                onChange={(e) => setNombreEspecialidad(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Costo Cita Médica</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Ej. 50, 45.50"
                value={costoEspecialidad}
                onChange={(e) => setCostoEspecialidad(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsModalOpen(false)
                setNombreEspecialidad("")
                setCostoEspecialidad("")
              }}
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
                  <Plus size={18} />
                  Registrar
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
