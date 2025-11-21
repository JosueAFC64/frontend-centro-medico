import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import AtencionesService from "../apiservice/atenciones-service"
import { FileText, Activity, Clipboard, X } from 'lucide-react';

export default function ModalVerAtencion({ isOpen, onClose, idCita }) {
  const [atencion, setAtencion] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (isOpen && idCita) {
      cargarAtencion()
    }
  }, [isOpen, idCita])

  const cargarAtencion = async () => {
    try {
      setCargando(true)
      const data = await AtencionesService.obtenerAtencionPorCita(idCita)
      setAtencion(data)
    } catch (error) {
      toast.error(error.message || "Error al cargar la atención")
      onClose()
    } finally {
      setCargando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto w-full animate-in slide-in-from-bottom duration-300">
        {/* Header mejorado */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Clipboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Detalle de Atención</h2>
                <p className="text-blue-100 text-sm">Información médica del paciente</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {cargando ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <div className="text-muted-foreground">Cargando información...</div>
            </div>
          ) : atencion ? (
            <div className="space-y-4">
              {/* Diagnóstico */}
              <div className="bg-linear-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-red-600 font-semibold uppercase mb-2 tracking-wide">
                      Diagnóstico
                    </p>
                    <p className="text-foreground font-medium whitespace-pre-wrap leading-relaxed">
                      {atencion.diagnostico || (
                        <span className="text-muted-foreground italic">No especificado</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tratamiento */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg shrink-0">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-600 font-semibold uppercase mb-2 tracking-wide">
                      Tratamiento
                    </p>
                    <p className="text-foreground font-medium whitespace-pre-wrap leading-relaxed">
                      {atencion.tratamiento || (
                        <span className="text-muted-foreground italic">No especificado</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                    <Clipboard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-600 font-semibold uppercase mb-2 tracking-wide">
                      Observaciones
                    </p>
                    <p className="text-foreground font-medium whitespace-pre-wrap leading-relaxed">
                      {atencion.observaciones || (
                        <span className="text-muted-foreground italic">No especificado</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <div className="text-muted-foreground text-lg font-medium">No se encontró la atención</div>
              <p className="text-sm text-muted-foreground mt-2">La atención solicitada no está disponible</p>
            </div>
          )}

          {/* Botón mejorado */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

