import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import disponibilidadesService from "../apiservice/disponibilidades-service"
import ModalDisponibilidad from "../components/ModalDisponibilidad"
import { Calendar, Search, Plus, Trash2, Clock, User, Stethoscope, Loader2, CalendarDays } from "lucide-react"

export default function Disponibilidades() {
  const [disponibilidades, setDisponibilidades] = useState([])
  const [filtradas, setFiltradas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    cargarDisponibilidades()
  }, [])

  const cargarDisponibilidades = async () => {
    try {
      setLoading(true)
      const data = await disponibilidadesService.listarDisponibilidades()
      setDisponibilidades(data)
      setFiltradas(data)
    } catch (error) {
      toast.error("Error al cargar disponibilidades")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    const filtered = disponibilidades.filter((disp) => disp.fecha.includes(value))
    setFiltradas(filtered)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar esta disponibilidad?")) {
      return
    }

    try {
      await disponibilidadesService.eliminarDisponibilidad(id)
      toast.success("Disponibilidad eliminada exitosamente")
      cargarDisponibilidades()
    } catch (error) {
      toast.error("Error al eliminar la disponibilidad")
    }
  }

  const formatearFecha = (fecha) => {
    const partes = fecha.split("-");
    const date = new Date(partes[0], partes[1] - 1, partes[2]); // año, mesIndex, día
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <CalendarDays className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            Disponibilidades
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 ml-14">Gestione los horarios y turnos médicos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-bold flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Nueva Disponibilidad
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="date"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
          />
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-auto">
          Mostrando <span className="text-slate-900 dark:text-white font-bold">{filtradas.length}</span> disponibilidades
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
          <div className="text-slate-500 font-medium">Cargando disponibilidades...</div>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No hay disponibilidades encontradas</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            {searchTerm ? "No se encontraron horarios para la fecha seleccionada." : "Aún no hay disponibilidades registradas en el sistema."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtradas.map((disponibilidad) => (
            <div
              key={disponibilidad.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEliminar(disponibilidad.id)}
                  className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                  title="Eliminar disponibilidad"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Médico</p>
                    <p className="text-slate-900 dark:text-white font-bold text-lg leading-tight mt-0.5">
                      {disponibilidad.medico.nombreCompleto}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-1">
                  <Stethoscope size={16} className="text-teal-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Especialidad</p>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{disponibilidad.especialidad.nombre}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-teal-500" />
                    <span className="text-slate-900 dark:text-white font-medium capitalize">
                      {formatearFecha(disponibilidad.fecha)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Clock size={16} className="text-teal-500" />
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span>{disponibilidad.hora_inicio}</span>
                      <span className="text-slate-400">-</span>
                      <span>{disponibilidad.hora_fin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalDisponibilidad isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={cargarDisponibilidades} />
    </div>
  )
}
