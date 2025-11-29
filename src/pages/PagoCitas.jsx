import { useState } from "react"
import { toast } from "react-toastify"
import pagoCitasService from "../apiservice/pagocitas-service"
import comprobantePagoService from "../apiservice/comprobantespago-service"
import ModalConfirmacionComprobante from "../components/ModalConfirmacionComprobante"
import { CreditCard, Search, FileText, Calendar, User, Stethoscope, Clock, Loader2, DollarSign, CheckCircle2, AlertCircle, XCircle } from "lucide-react"

export default function PagoCitas() {
  const [dni, setDni] = useState("")
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(false)
  const [buscado, setBuscado] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPago, setSelectedPago] = useState(null)

  const handleSearch = async (value) => {
    setDni(value)

    if (value.length === 0) {
      setPagos([])
      setBuscado(false)
      return
    }

    // Debounce search
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const data = await pagoCitasService.buscarPorDni(value)
        setPagos(data)
        setBuscado(true)
      } catch (error) {
        toast.error(error.message)
        setPagos([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }

  const handleGenerarComprobante = (pagoId) => {
    const pago = pagos.find((p) => p.id === pagoId)
    if (pago) {
      setSelectedPago(pago)
      setIsModalOpen(true)
    }
  }

  const handleConfirmComprobante = async (tipoComprobante) => {
    try {
      if (!selectedPago) {
        throw new Error("No se encontró el pago seleccionado")
      }

      await comprobantePagoService.generarComprobante(selectedPago.id, tipoComprobante, dni)
      toast.success("Comprobante generado exitosamente")
      setSelectedPago(null)
      setDni("")
      setPagos([])
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.message)
      throw error
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

  const formatearHora = (hora) => {
    return hora ? hora.substring(0, 5) : "-"
  }

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case "PAGADO":
        return {
          color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          icon: CheckCircle2
        }
      case "PENDIENTE":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
          icon: AlertCircle
        }
      case "CANCELADO":
        return {
          color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
          icon: XCircle
        }
      default:
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
          icon: AlertCircle
        }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <CreditCard className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            Pagos de Citas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 ml-14">Busque y gestione los pagos de citas médicas</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por DNI del paciente..."
              value={dni}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
            <div className="text-slate-500 font-medium">Buscando pagos...</div>
          </div>
        ) : !buscado ? (
          <div className="flex flex-col justify-center items-center h-64 text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ingrese un DNI para buscar</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Ingrese el número de documento del paciente para ver sus pagos pendientes e historial.
            </p>
          </div>
        ) : pagos.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No se encontraron pagos</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              No hay registros de pagos asociados al DNI ingresado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pagos.map((pago) => {
              const estadoConfig = getEstadoConfig(pago.estado)
              const EstadoIcon = estadoConfig.icon

              return (
                <div
                  key={pago.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 group"
                >
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                        <DollarSign size={24} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pago #{pago.id}</span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${estadoConfig.color}`}>
                            <EstadoIcon size={12} />
                            {pago.estado}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                          S/. {pago.montoTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-auto border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-4 lg:pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fecha Cita</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{formatearFecha(pago.citaMedica.fecha)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                            <Clock size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hora</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatearHora(pago.citaMedica.hora)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Médico</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{pago.citaMedica.medico}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                            <Stethoscope size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Especialidad</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{pago.citaMedica.especialidad}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleGenerarComprobante(pago.id)}
                        disabled={pago.estado !== "PENDIENTE"}
                        className={`w-full lg:w-auto px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all ${pago.estado === "PENDIENTE"
                            ? "bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-teal-500/20 hover:scale-105 active:scale-95"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                          }`}
                      >
                        <FileText size={18} />
                        Generar Comprobante
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ModalConfirmacionComprobante
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmComprobante}
        pagos={selectedPago ? [selectedPago] : []}
      />
    </div>
  )
}