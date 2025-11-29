import { Calendar, Clock, User, Stethoscope, FileText, Activity, ChevronLeft, ChevronRight, UserCheck, Pill, Microscope } from 'lucide-react';
import ModalVerReceta from './ModalVerReceta';
import ModalVerAnalisis from './ModalVerAnalisis';
import { useState } from 'react';

const ModalSeccionAtencion = ({ atencionActual, atenciones, paginaActual, setPaginaActual, formatearFecha }) => {
  const [showRecetaModal, setShowRecetaModal] = useState(false)
  const [showAnalisisModal, setShowAnalisisModal] = useState(false)

  if (!atencionActual) return null;

  return (
    <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-500" />
          Historial de Atenciones
        </h3>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Atención {paginaActual + 1} de {atenciones.length}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-teal-400 to-blue-500"></div>

        {/* Header de la atención */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-700 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-teal-500">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Especialidad</p>
              <p className="font-bold text-xl text-slate-900 dark:text-white">{atencionActual.cita.especialidad}</p>
            </div>
          </div>
          <div className="flex md:flex-col gap-4 md:gap-1 text-right">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 justify-end">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatearFecha(atencionActual.fechaAtencion || atencionActual.cita.fecha)}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 justify-end">
              <Clock className="w-4 h-4 text-slate-400" />
              {atencionActual.horaAtencion || atencionActual.cita.hora}
            </div>
          </div>
        </div>

        {/* Información del paciente y médicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Paciente</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-lg">{atencionActual.cita.paciente.nombre}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">DNI: {atencionActual.cita.paciente.dni}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Médico Asignado</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-lg">{atencionActual.cita.medico}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{atencionActual.cita.especialidad}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Médico Ejecutor</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-lg">{atencionActual.medicoEjecutor.nombreCompleto}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ejecutó la atención</p>
          </div>
        </div>

        {/* Motivo de reemplazo si existe */}
        {atencionActual.cita.motivoReemplazo && (
          <div className="mb-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg text-amber-600 dark:text-amber-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1 text-sm uppercase tracking-wide">Motivo de Reemplazo</h4>
                  <p className="text-amber-700 dark:text-amber-200 leading-relaxed text-sm">{atencionActual.cita.motivoReemplazo}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detalles médicos */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-500 dark:text-rose-400">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wide">Diagnóstico</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{atencionActual.diagnostico}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-500 dark:text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wide">Tratamiento</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{atencionActual.tratamiento}</p>
              </div>
            </div>
          </div>

          {atencionActual.observaciones && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wide">Observaciones</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{atencionActual.observaciones}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Receta y Análisis */}
          {(atencionActual.recetaMedica || atencionActual.analisisClinico) && (
            <div className="flex flex-wrap gap-4 pt-2">
              {atencionActual.recetaMedica && (
                <button
                  onClick={() => setShowRecetaModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors font-medium"
                >
                  <Pill size={18} />
                  Ver Receta
                </button>
              )}
              {atencionActual.analisisClinico && (
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
      </div>

      {/* Controles de paginación mejorados */}
      {atenciones.length > 1 && (
        <div className="flex justify-between items-center mt-6 gap-4">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 0))}
            disabled={paginaActual === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex gap-2">
            {atenciones.map((_, index) => (
              <button
                key={index}
                onClick={() => setPaginaActual(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === paginaActual
                  ? 'bg-teal-500 w-8'
                  : 'bg-slate-200 dark:bg-slate-700 w-2 hover:bg-teal-200 dark:hover:bg-teal-800'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, atenciones.length - 1))}
            disabled={paginaActual === atenciones.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modales adicionales */}
      {atencionActual && (
        <>
          <ModalVerReceta
            isOpen={showRecetaModal}
            onClose={() => setShowRecetaModal(false)}
            recetaData={atencionActual.recetaMedica}
          />
          <ModalVerAnalisis
            isOpen={showAnalisisModal}
            onClose={() => setShowAnalisisModal(false)}
            analisisData={atencionActual.analisisClinico}
          />
        </>
      )}
    </div>
  );
};

export default ModalSeccionAtencion;