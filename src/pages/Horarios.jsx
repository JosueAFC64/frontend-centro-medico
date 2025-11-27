import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import horariosService from "../apiservice/horarios-service"
import disponibilidadesService from "../apiservice/disponibilidades-service"
import ModalRegistroHorario from "../components/ModalRegistroHorario"
import DetallesPopover from "../components/DetallesPopover"
import { useAuth } from "../context/AuthContext"
import { Search, Plus, Calendar, Clock, MapPin, AlertCircle, CheckCircle2 } from "lucide-react"

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
      toast.error("Error al cargar horarios")
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isMedico ? "Mi Horario" : "Gestión de Horarios"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isMedico
              ? "Consulte su agenda y gestione sus citas médicas para mañana"
              : "Administre la programación y disponibilidad del personal médico"}
          </p>
        </div>

        {/* Botón de Nuevo Horario solo para Personal Administrativo */}
        {isPersonalAdministrativo && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-105 font-medium"
          >
            <Plus size={20} />
            Nuevo Horario
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar por fecha, médico o especialidad..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <div ref={horariosContainerRef} className="relative min-h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Cargando horarios...</p>
                </div>
              </div>
            ) : filtradas.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Calendar size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No hay horarios encontrados</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {searchTerm
                    ? "Intenta ajustar los términos de búsqueda"
                    : isMedico
                      ? "No tiene horarios asignados para mañana"
                      : "Comience registrando un nuevo horario para los médicos"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtradas.map((horario) => (
                  <div
                    key={horario.id}
                    onClick={(e) => handleDetallesClick(horario, e)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-xl hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-teal-500 to-teal-600 group-hover:w-1.5 transition-all"></div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
                            {horario.especialidad.nombre}
                          </p>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg line-clamp-1">
                            {horario.empleado.nombreCompleto}
                          </h3>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          S/. 
                          {typeof horario.especialidad.costo === 'number'
                            ? horario.especialidad.costo.toFixed(2)
                            : horario.especialidad.costo}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                          <MapPin size={16} className="text-teal-500 shrink-0" />
                          <span className="truncate">Cons. {horario.consultorio.nro_consultorio}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                          <Calendar size={16} className="text-teal-500 shrink-0" />
                          <span className="truncate capitalize">{formatearFecha(horario.fecha).split(',')[0]}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-teal-600 dark:text-teal-400" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Horario</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              {horario.horaInicio} - {horario.horaFin}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-center p-1">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
                          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{horario.totalSlots}</p>
                        </div>
                        <div className="text-center p-1 bg-red-50 dark:bg-red-900/10 rounded-lg">
                          <p className="text-[10px] text-red-500 uppercase font-bold">Ocupados</p>
                          <p className="text-lg font-bold text-red-600 dark:text-red-400">{horario.slotsOcupados}</p>
                        </div>
                        <div className="text-center p-1 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                          <p className="text-[10px] text-amber-500 uppercase font-bold">Bloq.</p>
                          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{horario.slotsBloqueados}</p>
                        </div>
                      </div>

                      {horario.estaCompleto && (
                        <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-200 dark:border-red-800 flex items-center gap-1">
                          <AlertCircle size={12} />
                          COMPLETO
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel de disponibilidades solo para Personal Administrativo */}
        {isPersonalAdministrativo && (
          <div className="hidden xl:block w-80 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-teal-500" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Disponibilidades</h3>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                {disponibilidades.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">No hay disponibilidades registradas</p>
                  </div>
                ) : (
                  disponibilidades.map((disponibilidad) => (
                    <div key={disponibilidad.id} className="group bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800 rounded-xl p-3 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xs shrink-0">
                          {disponibilidad.medico.nombreCompleto.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">
                            {disponibilidad.medico.nombreCompleto}
                          </p>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-1">
                            {disponibilidad.especialidad.nombre}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700 w-fit">
                            <Clock size={10} />
                            {disponibilidad.hora_inicio} - {disponibilidad.hora_fin}
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400">
                            {disponibilidad.fecha}
                          </div>
                        </div>
                      </div>
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