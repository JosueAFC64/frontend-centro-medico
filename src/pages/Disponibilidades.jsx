import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import disponibilidadesService from "../apiservice/disponibilidades-service"
import ModalDisponibilidad from "../components/ModalDisponibilidad"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Disponibilidades</h1>
        <p className="text-muted-foreground">Gestione las disponibilidades de los médicos</p>
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
              type="date"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
        >
          + Nueva Disponibilidad
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-muted-foreground">No hay disponibilidades registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((disponibilidad) => (
            <div
              key={disponibilidad.id}
              className="bg-white rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Médico</p>
                  <p className="text-foreground font-medium">{disponibilidad.medico.nombreCompleto}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Especialidad</p>
                  <p className="text-foreground font-medium">{disponibilidad.especialidad.nombre}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Fecha</p>
                  <p className="text-foreground font-medium">{formatearFecha(disponibilidad.fecha)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Hora Inicio</p>
                    <p className="text-foreground font-medium">{disponibilidad.hora_inicio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Hora Fin</p>
                    <p className="text-foreground font-medium">{disponibilidad.hora_fin}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleEliminar(disponibilidad.id)}
                  className="w-full px-3 py-2 mt-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalDisponibilidad isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={cargarDisponibilidades} />
    </div>
  )
}
