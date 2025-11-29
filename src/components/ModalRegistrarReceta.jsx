import { useState, useEffect, useMemo } from "react"
import { toast } from "react-toastify"
import MedicamentosService from "../apiservice/medicamentos-service"
import { X, Search, Pill, Plus, Trash2, Save } from "lucide-react"

export default function ModalRegistrarReceta({ isOpen, onClose, onSave, idMedico, dniPaciente, fechaSolicitud, recetaDataInicial = null }) {
  const [medicamentos, setMedicamentos] = useState([])
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [medicamentosAgregados, setMedicamentosAgregados] = useState([])
  const [medicamentoActual, setMedicamentoActual] = useState(null)
  const [formMedicamento, setFormMedicamento] = useState({
    dosis: "",
    frecuencia: "",
    viaAdministracion: "",
    cantidad: "",
  })

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

  // Cargar medicamentos cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return
    const cargarMedicamentos = async () => {
      try {
        const data = await MedicamentosService.listarMedicamentos()
        const medicamentosList = Array.isArray(data) ? data : []
        setMedicamentos(medicamentosList)
        
        // Cargar datos iniciales después de cargar los medicamentos
        if (recetaDataInicial?.detalles && medicamentosList.length > 0) {
          const medicamentosCargados = recetaDataInicial.detalles.map((detalle) => {
            const medicamento = medicamentosList.find((m) => m.id === detalle.idMedicamento)
            return {
              idMedicamento: detalle.idMedicamento,
              nombre: medicamento?.nombre || "",
              presentacion: medicamento?.presentacion || "",
              dosis: detalle.dosis,
              frecuencia: detalle.frecuencia,
              viaAdministracion: detalle.viaAdministracion,
              cantidad: detalle.cantidad,
            }
          })
          setMedicamentosAgregados(medicamentosCargados)
        } else if (!recetaDataInicial) {
          setMedicamentosAgregados([])
        }
      } catch (error) {
        toast.error(error.message || "Error al cargar medicamentos")
      }
    }
    cargarMedicamentos()
  }, [isOpen, recetaDataInicial])

  // Resetear estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setDebouncedQuery("")
      setMedicamentoActual(null)
      setFormMedicamento({
        dosis: "",
        frecuencia: "",
        viaAdministracion: "",
        cantidad: "",
      })
      // No limpiar medicamentosAgregados aquí para mantener los datos si se vuelve a abrir
    }
  }, [isOpen])

  // Filtrar medicamentos
  const filtrados = useMemo(() => {
    if (!debouncedQuery) return []
    const q = debouncedQuery.toLowerCase()
    return medicamentos.filter((m) => {
      const nombre = (m.nombre || "").toLowerCase()
      return nombre.includes(q)
    })
  }, [debouncedQuery, medicamentos])

  const handleSelectMedicamento = (medicamento) => {
    setMedicamentoActual(medicamento)
    setQuery("")
    setDebouncedQuery("")
    setFormMedicamento({
      dosis: "",
      frecuencia: "",
      viaAdministracion: "",
      cantidad: "",
    })
  }

  const handleChangeMedicamento = (e) => {
    const { name, value } = e.target
    setFormMedicamento((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAgregarMedicamento = () => {
    if (!medicamentoActual) {
      toast.warning("Seleccione un medicamento")
      return
    }
    if (!formMedicamento.dosis.trim()) {
      toast.warning("Ingrese la dosis")
      return
    }
    if (!formMedicamento.frecuencia.trim()) {
      toast.warning("Ingrese la frecuencia")
      return
    }
    if (!formMedicamento.viaAdministracion.trim()) {
      toast.warning("Ingrese la vía de administración")
      return
    }
    if (!formMedicamento.cantidad || parseInt(formMedicamento.cantidad) <= 0) {
      toast.warning("Ingrese una cantidad válida")
      return
    }

    const nuevoMedicamento = {
      idMedicamento: medicamentoActual.id,
      nombre: medicamentoActual.nombre,
      presentacion: medicamentoActual.presentacion,
      dosis: formMedicamento.dosis.trim(),
      frecuencia: formMedicamento.frecuencia.trim(),
      viaAdministracion: formMedicamento.viaAdministracion.trim(),
      cantidad: parseInt(formMedicamento.cantidad),
    }

    setMedicamentosAgregados((prev) => [...prev, nuevoMedicamento])
    setMedicamentoActual(null)
    setQuery("")
    setFormMedicamento({
      dosis: "",
      frecuencia: "",
      viaAdministracion: "",
      cantidad: "",
    })
  }

  const handleEliminarMedicamento = (index) => {
    setMedicamentosAgregados((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGuardar = () => {
    if (medicamentosAgregados.length === 0) {
      toast.warning("Agregue al menos un medicamento")
      return
    }

    const detalles = medicamentosAgregados.map((m) => ({
      idMedicamento: m.idMedicamento,
      dosis: m.dosis,
      frecuencia: m.frecuencia,
      viaAdministracion: m.viaAdministracion,
      cantidad: m.cantidad,
    }))

    const recetaData = {
      idMedico,
      dniPaciente,
      fechaSolicitud,
      detalles,
    }

    onSave && onSave(recetaData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full animate-in slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registrar Receta Médica</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Agregue los medicamentos a prescribir</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Buscador de medicamentos */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Pill size={16} className="text-teal-500" />
              Buscar Medicamento
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ingrese el nombre del medicamento..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
              {debouncedQuery && !medicamentoActual && filtrados.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-56 overflow-auto">
                  {filtrados.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMedicamento(m)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="font-medium text-slate-900 dark:text-white">{m.nombre}</div>
                      {m.presentacion && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">{m.presentacion}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Mensaje cuando no hay selecciones */}
            {medicamentosAgregados.length === 0 && !medicamentoActual && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Pill size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Busque y seleccione los tipos de análisis que desea solicitar</p>
              </div>
            )}
            {medicamentoActual && (
              <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                Seleccionado: {medicamentoActual.nombre}
                {medicamentoActual.presentacion && ` - ${medicamentoActual.presentacion}`}
              </div>
            )}
          </div>

          {/* Formulario de detalles del medicamento */}
          {medicamentoActual && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Detalles del Medicamento
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Dosis</label>
                  <input
                    type="text"
                    name="dosis"
                    value={formMedicamento.dosis}
                    onChange={handleChangeMedicamento}
                    placeholder="Ej: 500 mg"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Frecuencia</label>
                  <input
                    type="text"
                    name="frecuencia"
                    value={formMedicamento.frecuencia}
                    onChange={handleChangeMedicamento}
                    placeholder="Ej: Cada 8 horas"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Vía de Administración</label>
                  <input
                    type="text"
                    name="viaAdministracion"
                    value={formMedicamento.viaAdministracion}
                    onChange={handleChangeMedicamento}
                    placeholder="Ej: Oral"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={formMedicamento.cantidad}
                    onChange={handleChangeMedicamento}
                    placeholder="Ej: 21"
                    min="1"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleAgregarMedicamento}
                className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Agregar Medicamento
              </button>
            </div>
          )}

          {/* Lista de medicamentos agregados */}
          {medicamentosAgregados.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Medicamentos Agregados ({medicamentosAgregados.length})
              </h3>
              <div className="space-y-2">
                {medicamentosAgregados.map((med, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">{med.nombre}</div>
                        {med.presentacion && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">{med.presentacion}</div>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Dosis: </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{med.dosis}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Frecuencia: </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{med.frecuencia}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Vía: </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{med.viaAdministracion}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Cantidad: </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{med.cantidad}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEliminarMedicamento(index)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
            <Save size={18} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

