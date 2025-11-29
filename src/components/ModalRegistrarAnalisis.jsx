import { useState, useEffect, useMemo } from "react"
import { toast } from "react-toastify"
import TipoAnalisisService from "../apiservice/tipoanalisis-service"
import { X, Search, FlaskConical, CheckCircle2 } from "lucide-react"

export default function ModalRegistrarAnalisis({ isOpen, onClose, onSave, idMedico, dniPaciente, fechaSolicitud, analisisDataInicial = null }) {
  const [tiposAnalisis, setTiposAnalisis] = useState([])
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [tiposSeleccionados, setTiposSeleccionados] = useState([])

  // Debounce para la búsqueda
  useEffect(() => {
    let timer
    timer = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 400)
    return () => {
      clearTimeout(timer)
    }
  }, [query])

  // Cargar tipos de análisis cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return
    const cargarTiposAnalisis = async () => {
      try {
        const data = await TipoAnalisisService.listarTipoAnalisis()
        const tiposList = Array.isArray(data) ? data : []
        setTiposAnalisis(tiposList)
        
        // Cargar datos iniciales después de cargar los tipos
        if (analisisDataInicial?.tipoAnalisisIds && tiposList.length > 0) {
          const tiposCargados = tiposList.filter((t) =>
            analisisDataInicial.tipoAnalisisIds.includes(t.id)
          )
          setTiposSeleccionados(tiposCargados)
        } else if (!analisisDataInicial) {
          setTiposSeleccionados([])
        }
      } catch (error) {
        toast.error(error.message || "Error al cargar tipos de análisis")
      }
    }
    cargarTiposAnalisis()
  }, [isOpen, analisisDataInicial])

  // Resetear estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setDebouncedQuery("")
    }
  }, [isOpen])

  // Filtrar tipos de análisis
  const filtrados = useMemo(() => {
    if (!debouncedQuery) return []
    const q = debouncedQuery.toLowerCase()
    return tiposAnalisis.filter((t) => {
      const nombre = (t.nombre || "").toLowerCase()
      return nombre.includes(q)
    })
  }, [debouncedQuery, tiposAnalisis])

  const handleToggleAnalisis = (tipoAnalisis) => {
    setTiposSeleccionados((prev) => {
      const existe = prev.find((t) => t.id === tipoAnalisis.id)
      if (existe) {
        return prev.filter((t) => t.id !== tipoAnalisis.id)
      } else {
        return [...prev, tipoAnalisis]
      }
    })
    setQuery("")
    setDebouncedQuery("")
  }

  const handleGuardar = () => {
    if (tiposSeleccionados.length === 0) {
      toast.warning("Seleccione al menos un tipo de análisis")
      return
    }

    const tipoAnalisisIds = tiposSeleccionados.map((t) => t.id)

    const analisisData = {
      idMedico,
      dniPaciente,
      fechaSolicitud,
      tipoAnalisisIds,
    }

    onSave && onSave(analisisData)
    onClose()
  }

  const handleEliminarAnalisis = (id) => {
    setTiposSeleccionados((prev) => prev.filter((t) => t.id !== id))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registrar Análisis Clínico</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Seleccione los tipos de análisis a solicitar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Buscador de tipos de análisis */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <FlaskConical size={16} className="text-teal-500" />
              Buscar Tipo de Análisis
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ingrese el nombre del tipo de análisis..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
              {debouncedQuery && filtrados.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-56 overflow-auto">
                  {filtrados
                    .filter((t) => !tiposSeleccionados.find((s) => s.id === t.id))
                    .map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleAnalisis(t)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="font-medium text-slate-900 dark:text-white">{t.nombre}</div>
                        {t.muestraRequerida && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">Muestra: {t.muestraRequerida}</div>
                        )}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Lista de tipos seleccionados */}
          {tiposSeleccionados.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tipos de Análisis Seleccionados ({tiposSeleccionados.length})
              </h3>
              <div className="space-y-2">
                {tiposSeleccionados.map((tipo) => (
                  <div
                    key={tipo.id}
                    className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-teal-500" />
                        <div className="font-medium text-slate-900 dark:text-white">{tipo.nombre}</div>
                      </div>
                      {tipo.muestraRequerida && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Muestra requerida: {tipo.muestraRequerida}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleEliminarAnalisis(tipo.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje cuando no hay selecciones */}
          {tiposSeleccionados.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <FlaskConical size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Busque y seleccione los tipos de análisis que desea solicitar</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

