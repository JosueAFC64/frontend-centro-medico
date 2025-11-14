import { useState } from "react"
import { toast } from "react-toastify"
import pagoCitasService from "../apiservice/pagocitas-service"
import comprobantePagoService from "../apiservice/comprobantespago-service"
import ModalConfirmacionComprobante from "../components/ModalConfirmacionComprobante"

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
      setSelectedPago([])
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

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PAGADO":
        return "bg-green-50 border-green-200 text-green-700"
      case "PENDIENTE":
        return "bg-yellow-50 border-yellow-200 text-yellow-700"
      case "CANCELADO":
        return "bg-red-50 border-red-200 text-red-700"
      default:
        return "bg-gray-50 border-gray-200 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pagos de Citas</h1>
        <p className="text-muted-foreground">Busque y gestione los pagos de citas médicas</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
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
              placeholder="Buscar por DNI del paciente..."
              value={dni}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-muted-foreground">Buscando...</div>
          </div>
        ) : !buscado ? (
          <div className="text-center py-12 bg-white rounded-lg border border-border">
            <svg
              className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-40"
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
            <p className="text-muted-foreground">Ingrese un DNI para buscar pagos</p>
          </div>
        ) : pagos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-border">
            <p className="text-muted-foreground">No se encontraron pagos para este DNI</p>
          </div>
        ) : (
          pagos.map((pago) => (
            <div
              key={pago.id}
              className="bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Pago ID</p>
                  <p className="text-sm font-medium text-foreground">{pago.id}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Cita Médica</p>
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-foreground">{formatearFecha(pago.citaMedica.fecha)}</p>
                    <p className="text-muted-foreground">{formatearHora(pago.citaMedica.hora)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Médico & Especialidad</p>
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-foreground">{pago.citaMedica.medico}</p>
                    <p className="text-muted-foreground">{pago.citaMedica.especialidad}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Monto Total</p>
                  <p className="text-lg font-bold text-primary">S/. {pago.montoTotal.toFixed(2)}</p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(pago.estado)}`}>
                    {pago.estado}
                  </div>
                  <button
                    onClick={() => handleGenerarComprobante(pago.id)}
                    disabled={pago.estado !== "PENDIENTE"}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${pago.estado === "PENDIENTE"
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Generar Comprobante
                  </button>
                </div>

              </div>
            </div>
          ))
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