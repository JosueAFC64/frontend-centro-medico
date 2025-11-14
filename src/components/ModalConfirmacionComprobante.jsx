import { useState } from "react"
import { toast } from "react-toastify"

export default function ModalConfirmacionComprobante({ isOpen, onClose, onConfirm, pagos }) {
  const [tipoComprobante, setTipoComprobante] = useState("BOLETA")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!tipoComprobante) {
      toast.error("Seleccione un tipo de comprobante")
      return
    }

    setLoading(true)
    try {
      await onConfirm(tipoComprobante)
      setTipoComprobante("BOLETA")
      onClose()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 animate-in fade-in duration-200">
        <h2 className="text-xl font-bold text-foreground mb-4">Generar Comprobante de Pago</h2>

        <div className="mb-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Se generará un comprobante para {pagos.length} pago(s) seleccionado(s)
          </p>
          <div className="space-y-2">
            {pagos.map((pago) => (
              <div key={pago.id} className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                Pago ID: {pago.id} - S/. {pago.montoTotal.toFixed(2)}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Tipo de Comprobante</label>
          <select
            value={tipoComprobante}
            onChange={(e) => setTipoComprobante(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="BOLETA">Boleta</option>
            <option value="FACTURA">Factura</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-foreground border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Generando..." : "Generar"}
          </button>
        </div>
      </div>
    </div>
  )
}
