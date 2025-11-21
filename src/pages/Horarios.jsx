import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import horariosService from "../apiservice/horarios-service"
import disponibilidadesService from "../apiservice/disponibilidades-service"
import ModalRegistroHorario from "../components/ModalRegistroHorario"
import DetallesPopover from "../components/DetallesPopover"
import { useAuth } from "../context/AuthContext"

export default function Horarios() {
  const { user } = useAuth()
  const [horarios, setHorarios] = useState([])
  const [disponibilidades, setDisponibilidades] = useState([])
  const [filtradas, setFiltradas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDetalles, setSelectedDetalles] = useState(null)
  const [selectedHorario, setSelectedHorario] = useState(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const horariosContainerRef = useRef(null)

  // Determinar si el usuario es médico o personal administrativo
  const isMedico = user?.rol === "MEDICO"
  const isPersonalAdministrativo = user?.rol === "PERSONAL_ADMINISTRATIVO"

  useEffect(() => {
    cargarDatos()
  }, [])

  // Función para obtener la fecha de mañana en formato LocalDate (YYYY-MM-DD)
  const obtenerFechaManana = () => {
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    const year = manana.getFullYear()
    const month = String(manana.getMonth() + 1).padStart(2, '0')
    const day = String(manana.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      let horariosData = []
      
      // Cargar horarios según el rol del usuario
      if (isMedico) {
        // Para médicos: obtener solo sus horarios usando su ID y fecha de mañana
        const fechaManana = obtenerFechaManana()
        horariosData = await horariosService.obtenerHorarioPorIdyFecha({
          idEmpleado: user.id,
          fecha: fechaManana
        })
        // Si el servicio devuelve un solo objeto, convertirlo a array
        if (!Array.isArray(horariosData)) {
          horariosData = horariosData ? [horariosData] : []
        }
      } else if (isPersonalAdministrativo) {
        // Para personal administrativo: obtener todos los horarios
        horariosData = await horariosService.listarHorarios()
      }

      const horariosOrdenados = horariosData.sort((a, b) => {
        const horaA = Number.parseInt(a.horaInicio.replace(":", ""))
        const horaB = Number.parseInt(b.horaInicio.replace(":", ""))
        return horaA - horaB
      })
      
      setHorarios(horariosOrdenados)
      setFiltradas(horariosOrdenados)

      // Cargar disponibilidades solo para personal administrativo
      if (isPersonalAdministrativo) {
        const disponibilidadesData = await disponibilidadesService.listarDisponibilidades()
        setDisponibilidades(disponibilidadesData)
      }
    } catch (error) {
      toast.error("Error al cargar horarios", error)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    const filtered = horarios.filter((horario) => {
      const fecha = horario.fecha.toLowerCase()
      const medico = horario.empleado.nombreCompleto.toLowerCase()
      const especialidad = horario.especialidad.nombre.toLowerCase()
      return (
        fecha.includes(value.toLowerCase()) ||
        medico.includes(value.toLowerCase()) ||
        especialidad.includes(value.toLowerCase())
      )
    })
    setFiltradas(filtered)
  }

  const handleDetallesClick = (horario, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = horariosContainerRef.current?.getBoundingClientRect() || { top: 0, left: 0 }

    setPopoverPosition({
      top: rect.top - containerRect.top + window.scrollY,
      left: rect.right - containerRect.left + 16,
    })
    setSelectedDetalles(horario.detalles)
    setSelectedHorario(horario)
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
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isMedico ? "Mi Horario" : "Horarios"}
        </h1>
        <p className="text-muted-foreground">
          {isMedico 
            ? "Consulte su horario de atención y gestione sus citas médicas" 
            : "Gestione los horarios de atención de los médicos"}
        </p>
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
              placeholder="Buscar por fecha, médico o especialidad..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        {/* Botón de Nuevo Horario solo para Personal Administrativo */}
        {isPersonalAdministrativo && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
          >
            + Nuevo Horario
          </button>
        )}
      </div>

      <div className="flex gap-6">
        <div ref={horariosContainerRef} className="flex-1 relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-muted-foreground">Cargando...</div>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-border">
              <p className="text-muted-foreground">
                {isMedico 
                  ? "No tiene horarios asignados para mañana" 
                  : "No hay horarios registrados"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtradas.map((horario) => (
                <div
                  key={horario.id}
                  onClick={(e) => handleDetallesClick(horario, e)}
                  className="bg-white rounded-lg border border-border p-4 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Médico</p>
                        <p className="text-foreground font-medium text-sm">{horario.empleado.nombreCompleto}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Costo</p>
                        <p className="text-foreground font-medium text-sm">
                          {typeof horario.especialidad.costo === 'number' 
                            ? `S/. ${horario.especialidad.costo.toFixed(2)}`
                            : `$${horario.especialidad.costo}`}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Especialidad</p>
                      <p className="text-foreground font-medium text-sm">{horario.especialidad.nombre}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Consultorio</p>
                        <p className="text-foreground font-medium text-sm">{horario.consultorio.nro_consultorio}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Fecha</p>
                        <p className="text-foreground font-medium text-sm">{formatearFecha(horario.fecha)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Hora Inicio</p>
                        <p className="text-foreground font-medium text-sm">{horario.horaInicio}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Hora Fin</p>
                        <p className="text-foreground font-medium text-sm">{horario.horaFin}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-sm font-semibold text-foreground">{horario.totalSlots}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Ocupados</p>
                        <p className="text-sm font-semibold text-red-600">{horario.slotsOcupados}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Bloqueados</p>
                        <p className="text-sm font-semibold text-yellow-600">{horario.slotsBloqueados}</p>
                      </div>
                    </div>

                    {horario.estaCompleto && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium text-center">
                        Horario Completo
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de disponibilidades solo para Personal Administrativo */}
        {isPersonalAdministrativo && (
          <div className="hidden lg:block w-80 max-h-96 overflow-y-auto">
            <div className="bg-white rounded-lg border border-border p-4 sticky top-0">
              <h3 className="font-semibold text-foreground mb-4">Disponibilidades</h3>
              <div className="space-y-3">
                {disponibilidades.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No hay disponibilidades</p>
                ) : (
                  disponibilidades.map((disponibilidad) => (
                    <div key={disponibilidad.id} className="border border-border rounded p-2 text-xs">
                      <p className="font-semibold text-foreground">{disponibilidad.medico.nombreCompleto}</p>
                      <p className="text-muted-foreground">{disponibilidad.especialidad.nombre}</p>
                      <p className="text-muted-foreground mt-1">
                        {disponibilidad.hora_inicio} - {disponibilidad.hora_fin} | {disponibilidad.fecha}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <DetallesPopover
        isOpen={selectedDetalles !== null}
        position={popoverPosition}
        detalles={selectedDetalles}
        onClose={() => setSelectedDetalles(null)}
        onCitaRegistrada={cargarDatos}
        onCitaCompletadaoCancelada={cargarDatos}
        horario={selectedHorario}
        userRol={user?.rol}
      />

      {/* Modal de registro solo para Personal Administrativo */}
      {isPersonalAdministrativo && (
        <ModalRegistroHorario isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={cargarDatos} />
      )}
    </div>
  )
}