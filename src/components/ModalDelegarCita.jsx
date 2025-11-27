import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import empleadosService from "../apiservice/empleados-service"
import citasMedicasService from "../apiservice/citasmedicas-service"
import Modal from "./Modal"
import { Search, User, Save, Loader2, ClipboardList } from "lucide-react"

export default function ModalDelegarCita({ isOpen, onClose, onSave, idCita }) {
  const [medicos, setMedicos] = useState([])
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedMedico, setSelectedMedico] = useState(null)
  const [motivo, setMotivo] = useState("")
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let timer
    timer = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 400)
    return () => {
      clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    if (!isOpen) return
    const cargarMedicos = async () => {
      try {
        const data = await empleadosService.listarMedicos()
        setMedicos(Array.isArray(data) ? data : [])
      } catch (error) {
        toast.error(error.message || "Error al cargar médicos")
      }
    }
    cargarMedicos()
  }, [isOpen])

  // Resetear el estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setDebouncedQuery("")
      setSelectedMedico(null)
      setMotivo("")
    }
  }, [isOpen])

  const filtrados = useMemo(() => {
    if (!debouncedQuery) return []
    const q = debouncedQuery.toLowerCase()
    return medicos.filter((m) => (m.nombreCompleto || "").toLowerCase().includes(q))
  }, [debouncedQuery, medicos])

  const handleSelectMedico = (medico) => {
    setSelectedMedico(medico)
    setQuery(medico.nombreCompleto || "")
    setDebouncedQuery("") // ← ESTA ES LA LÍNEA CLAVE: limpia la búsqueda
  }

  const handleDelegar = async () => {
    if (!selectedMedico?.id) {
      toast.warning("Seleccione el médico delegado")
      return
    }
    if (!motivo.trim()) {
      toast.warning("Ingrese el motivo de la delegación")
      return
    }
    try {
      setEnviando(true)
      await citasMedicasService.delegarCita(idCita, selectedMedico.id, { motivoReemplazo: motivo.trim() })
      toast.success("Cita delegada exitosamente")
      setQuery("")
      setSelectedMedico(null)
      setMotivo("")
      onSave && onSave()
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al delegar cita")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delegar Cita">
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <User size={16} className="text-teal-500" />
            Médico Delegado
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={enviando}
              placeholder="Ingrese el nombre del médico..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
            {/* Solo mostrar dropdown si hay debouncedQuery y no hay médico seleccionado */}
            {debouncedQuery && !selectedMedico && filtrados.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-56 overflow-auto">
                {filtrados.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMedico(m)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {m.nombreCompleto}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedMedico && (
            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">Seleccionado: {selectedMedico.nombreCompleto}</div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <ClipboardList size={16} className="text-teal-500" />
            Motivo o razón
          </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={enviando}
            placeholder="Describa el motivo de la delegación..."
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={onClose}
            disabled={enviando}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelegar}
            disabled={enviando}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
          >
            {enviando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Delegando...
              </>
            ) : (
              <>
                <Save size={18} />
                Delegar
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}