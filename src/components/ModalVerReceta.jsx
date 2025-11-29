import { useState, useEffect } from "react"
import { X, Loader2, FileText, User, Calendar, Stethoscope, Pill } from 'lucide-react';
import RecetaMedicaService from "../apiservice/recetamedica-service"
import { toast } from "react-toastify"

export default function ModalVerReceta({ isOpen, onClose, idAtencion, recetaData }) {
    const [receta, setReceta] = useState(null)
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        if (isOpen) {
            if (recetaData) {
                setReceta(recetaData)
            } else if (idAtencion) {
                cargarReceta()
            }
        }
    }, [isOpen, idAtencion, recetaData])

    const cargarReceta = async () => {
        try {
            setCargando(true)
            const data = await RecetaMedicaService.buscarRecetaPorIdAtencion(idAtencion)
            setReceta(data)
        } catch (error) {
            console.error(error)
            toast.error("Error al cargar la receta médica")
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-60 p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <Pill size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Receta Médica</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Detalles de la prescripción</p>
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
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
                            <div className="text-slate-500 font-medium">Cargando receta...</div>
                        </div>
                    ) : receta ? (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                        <Calendar size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Fecha de Solicitud</span>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {receta.fechaSolicitud ? formatearFecha(receta.fechaSolicitud) : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                        <FileText size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">ID Receta</span>
                                    </div>
                                    <p className="font-mono font-semibold text-slate-900 dark:text-white">
                                        #{receta.id}
                                    </p>
                                </div>
                            </div>

                            {/* Paciente & Medico */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Paciente */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <User size={18} className="text-blue-500" />
                                        Paciente
                                    </h3>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {receta.paciente?.nombres} {receta.paciente?.apellidos}
                                        </p>
                                        <div className="mt-2 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                                            <p>DNI: {receta.paciente?.dni}</p>
                                            <p>Nacimiento: {receta.paciente?.fechaNacimiento}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Medico */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Stethoscope size={18} className="text-emerald-500" />
                                        Médico
                                    </h3>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {receta.medico?.nombreCompleto}
                                        </p>
                                        <div className="mt-2 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                                            <p>ID Médico: {receta.medico?.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medicamentos */}
                            {receta.detalles && receta.detalles.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Pill size={18} className="text-purple-500" />
                                        Medicamentos Prescritos
                                    </h3>
                                    <div className="space-y-3">
                                        {receta.detalles.map((detalle, index) => (
                                            <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{detalle.medicamento.nombre} - {detalle.medicamento.presentacion}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dosis: {detalle.dosis}</p>
                                                    </div>
                                                    <div className="space-y-1 text-sm">
                                                        <p className="text-slate-600 dark:text-slate-300">Frecuencia: {detalle.frecuencia}</p>
                                                        <p className="text-slate-600 dark:text-slate-300">Vía: {detalle.viaAdministracion}</p>
                                                        <p className="text-slate-600 dark:text-slate-300">Cantidad: {detalle.cantidad}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-64 text-center">
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                <Pill className="w-10 h-10 text-slate-400" />
                            </div>
                            <div className="text-slate-900 dark:text-white text-lg font-semibold">No se encontró la receta</div>
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
    )
}