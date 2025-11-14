import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import EspecialidadesService from "../apiservice/especialidades-service"
import Modal from "../components/Modal"

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
      console.log(data)
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
      setIsModalOpen(false)
      cargarEspecialidades()
    } catch (error) {
      toast.error("Error al registrar la especialidad")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Especialidades</h1>
        <p className="text-muted-foreground">Gestione las especialidades médicas</p>
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
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
        >
          + Nueva Especialidad
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-muted-foreground">No hay especialidades registradas</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Costo Cita Médica</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtrados.map((especialidad) => (
                <tr key={especialidad.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{especialidad.nombre}</td>
                  <td className="px-6 py-4 text-foreground">S/. {especialidad.costo}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEliminar(especialidad.id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setNombreEspecialidad("")
        }}
        title="Nueva Especialidad"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
          <input
            type="text"
            placeholder="Ej. Cardiología, Pediatría"
            value={nombreEspecialidad}
            onChange={(e) => setNombreEspecialidad(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Costo Cita Médica</label>
          <input
            type="text"
            placeholder="Ej. 50, 45.50"
            value={costoEspecialidad}
            onChange={(e) => setCostoEspecialidad(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsModalOpen(false)
              setNombreEspecialidad("")
            }}
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
      </Modal>
    </div>
  )
}
