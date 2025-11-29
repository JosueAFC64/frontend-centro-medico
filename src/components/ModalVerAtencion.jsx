import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import AtencionesService from "../apiservice/atenciones-service"
import { FileText, Activity, Clipboard, X, Loader2, Calendar, Clock, Pill, Microscope } from 'lucide-react';
import ModalVerReceta from "./ModalVerReceta";
import ModalVerAnalisis from "./ModalVerAnalisis";

export default function ModalVerAtencion({ isOpen, onClose, idCita }) {
  const [atencion, setAtencion] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [showRecetaModal, setShowRecetaModal] = useState(false)
  const [showAnalisisModal, setShowAnalisisModal] = useState(false)

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

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400">
                <Clipboard size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detalle de Atención</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Información médica registrada</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            {cargando ? (
              <div className="flex flex-col justify-center items-center h-64">
                <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
                <div className="text-slate-500 font-medium">Cargando información...</div>
              </div>
            ) : atencion ? (
              <div className="space-y-5">
                {/* Información de fecha y hora */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 border-b border-indigo-100 dark:border-indigo-800/50 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm uppercase tracking-wide">Fecha y Hora de Atención</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                          <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fecha</p>
                          <p className="text-slate-700 dark:text-slate-300 font-semibold">
                            {atencion.fechaAtencion ? formatearFecha(atencion.fechaAtencion) : <span className="text-slate-400 italic">No especificada</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Clock size={16} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hora</p>
                          <p className="text-slate-700 dark:text-slate-300 font-semibold">
                            {atencion.horaAtencion || <span className="text-slate-400 italic">No especificada</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-rose-50 dark:bg-rose-900/20 px-4 py-3 border-b border-rose-100 dark:border-rose-800/50 flex items-center gap-2">
                    <FileText size={18} className="text-rose-600 dark:text-rose-400" />
                    <h3 className="font-bold text-rose-700 dark:text-rose-400 text-sm uppercase tracking-wide">Diagnóstico</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {atencion.diagnostico || <span className="text-slate-400 italic">No especificado</span>}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 border-b border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2">
                    <Activity size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm uppercase tracking-wide">Tratamiento</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {atencion.tratamiento || <span className="text-slate-400 italic">No especificado</span>}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-blue-100 dark:border-blue-800/50 flex items-center gap-2">
                    <Clipboard size={18} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-blue-700 dark:text-blue-400 text-sm uppercase tracking-wide">Observaciones</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {atencion.observaciones || <span className="text-slate-400 italic">No especificado</span>}
                    </p>
                  </div>
                </div>

                {/* Botones de Receta y Análisis */}
                {(atencion.recetaMedica || atencion.analisisClinico) && (
                  <div className="flex flex-wrap gap-4 pt-2">
                    {atencion.recetaMedica && (
                      <button
                        onClick={() => setShowRecetaModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors font-medium"
                      >
                        <Pill size={18} />
                        Ver Receta
                      </button>
                    )}
                    {atencion.analisisClinico && (
                      <button
                        onClick={() => setShowAnalisisModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                      >
                        <Microscope size={18} />
                        Ver Análisis
                      </button>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-64 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <div className="text-slate-900 dark:text-white text-lg font-semibold">No se encontró la atención</div>
                <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">La información de la atención solicitada no está disponible en este momento.</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold shadow-sm hover:shadow-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modales adicionales */}
      {atencion && (
        <>
          <ModalVerReceta
            isOpen={showRecetaModal}
            onClose={() => setShowRecetaModal(false)}
            idAtencion={atencion.id}
          />
          <ModalVerAnalisis
            isOpen={showAnalisisModal}
            onClose={() => setShowAnalisisModal(false)}
            idAtencion={atencion.id}
          />
        </>
      )}
    </>
  )
}