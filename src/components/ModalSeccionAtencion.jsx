import { Calendar, Clock, User, Stethoscope, FileText, Activity } from 'lucide-react';

// Componente mejorado para la sección de atenciones
const ModalSeccionAtencion = ({ atencionActual, atenciones, paginaActual, setPaginaActual, formatearFecha }) => {
  if (!atencionActual) return null;

  return (
    <div className="border-t pt-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Historial de Atenciones
        </h3>
        <div className="text-sm text-muted-foreground bg-accent px-3 py-1 rounded-full">
          {paginaActual + 1} de {atenciones.length}
        </div>
      </div>

      {/* Card de la atención */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        {/* Header de la atención */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Atención Médica</p>
              <p className="font-semibold text-lg text-foreground">{atencionActual.cita.especialidad}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              {formatearFecha(atencionActual.cita.fecha)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {atencionActual.cita.hora}
            </div>
          </div>
        </div>

        {/* Información del paciente y médico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Paciente</span>
            </div>
            <p className="font-semibold text-foreground">{atencionActual.cita.paciente.nombre}</p>
            <p className="text-sm text-muted-foreground">DNI: {atencionActual.cita.paciente.dni}</p>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Médico Tratante</span>
            </div>
            <p className="font-semibold text-foreground">{atencionActual.cita.medico}</p>
            <p className="text-sm text-muted-foreground">{atencionActual.cita.especialidad}</p>
          </div>
        </div>

        {/* Detalles médicos */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-2 mb-2">
              <FileText className="w-4 h-4 text-red-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Diagnóstico</h4>
                <p className="text-sm text-foreground leading-relaxed">{atencionActual.diagnostico}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Tratamiento</h4>
                <p className="text-sm text-foreground leading-relaxed">{atencionActual.tratamiento}</p>
              </div>
            </div>
          </div>

          {atencionActual.observaciones && (
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Observaciones</h4>
                  <p className="text-sm text-foreground leading-relaxed">{atencionActual.observaciones}</p>
                </div>
              </div>
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
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          
          <div className="flex gap-2">
            {atenciones.map((_, index) => (
              <button
                key={index}
                onClick={() => setPaginaActual(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === paginaActual 
                    ? 'bg-primary w-8' 
                    : 'bg-border hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, atenciones.length - 1))}
            disabled={paginaActual === atenciones.length - 1}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ModalSeccionAtencion;