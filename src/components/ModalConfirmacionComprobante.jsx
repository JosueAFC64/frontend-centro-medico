import { useState } from "react"
import { toast } from "react-toastify"
import Modal from "./Modal"
import { FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

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
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Comprobante">
      <div className="space-y-6">
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-teal-900 dark:text-teal-100">
              Confirmación de Generación
            </p>
            <p className="text-xs text-teal-700 dark:text-teal-300">
              Se generará un comprobante electrónico para {pagos.length} pago(s) seleccionado(s). Por favor verifique los datos antes de continuar.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Detalles del Pago
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
            {pagos.map((pago) => (
              <div
                key={pago.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 font-bold text-xs">
                    #{pago.id}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Monto</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">S/. {pago.montoTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Tipo de Comprobante
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={tipoComprobante}
              onChange={(e) => setTipoComprobante(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none"
            >
              <option value="BOLETA">Boleta de Venta</option>
              <option value="FACTURA">Factura Electrónica</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Generar
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
