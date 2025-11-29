import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import EspecialidadesService from "../apiservice/especialidades-service"
import Modal from "./Modal"
import { User, Briefcase, CreditCard, Phone, Mail, Stethoscope, Plus, X, Save, Loader2 } from "lucide-react"

export default function ModalEmpleado({ isOpen, onClose, onSave, empleado = null, isLoading = false }) {
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState([])
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cargo: "",
    dni: "",
    telefono: "",
    correo: "",
    especialidadesIds: [],
  })
  const [cargandoEspecialidades, setCargandoEspecialidades] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (isOpen) {
      cargarEspecialidades()
      if (empleado) {
        setFormData({
          nombres: empleado.nombres || "",
          apellidos: empleado.apellidos || "",
          cargo: empleado.cargo || "",
          dni: empleado.dni || "",
          telefono: empleado.telefono || "",
          correo: empleado.correo || "",
          especialidadesIds: empleado.especialidades?.map((e) => e.id) || [],
        })
      } else {
        setFormData({
          nombres: "",
          apellidos: "",
          cargo: "",
          dni: "",
          telefono: "",
          correo: "",
          especialidadesIds: [],
        })
      }
    }
  }, [isOpen, empleado])

  const cargarEspecialidades = async () => {
    try {
      setCargandoEspecialidades(true)
      const data = await EspecialidadesService.listarEspecialidades()
      setEspecialidadesDisponibles(data)
    } catch (error) {
      toast.error("Error al cargar especialidades")
    } finally {
      setCargandoEspecialidades(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const agregarEspecialidad = (especialidadId) => {
    if (!formData.especialidadesIds.includes(especialidadId)) {
      setFormData((prev) => ({
        ...prev,
        especialidadesIds: [...prev.especialidadesIds, especialidadId],
      }))
    }
  }

  const quitarEspecialidad = (especialidadId) => {
    setFormData((prev) => ({
      ...prev,
      especialidadesIds: prev.especialidadesIds.filter((id) => id !== especialidadId),
    }))
  }

  const obtenerNombreEspecialidad = (id) => {
    return especialidadesDisponibles.find((e) => e.id === id)?.nombre || ""
  }

  const handleGuardar = async () => {
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.cargo.trim()) {
      toast.warning("Por favor complete los campos requeridos")
      return
    }

    try {
      setEnviando(true)
      await onSave(formData)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={empleado ? "Ver/Editar Empleado" : "Nuevo Empleado"}>
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Nombres <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                placeholder="Nombres"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Apellidos <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                placeholder="Apellidos"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Cargo */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Cargo <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              name="cargo"
              value={formData.cargo}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none"
            >
              <option value="">Selecciona un cargo</option>
              <option value="MEDICO">Médico</option>
              <option value="ENFERMERA">Enfermera</option>
              <option value="PERSONAL_ADMINISTRATIVO">Personal Administrativo</option>
            </select>
          </div>
        </div>

        {/* DNI y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              DNI
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                placeholder="DNI"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Correo */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              placeholder="Correo"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Especialidades */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
            <Stethoscope size={14} />
            Especialidades
          </label>

          {/* Especialidades seleccionadas */}
          {formData.especialidadesIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.especialidadesIds.map((id) => (
                <div
                  key={id}
                  className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-teal-100 dark:border-teal-800 animate-in zoom-in duration-200"
                >
                  <span>{obtenerNombreEspecialidad(id)}</span>
                  <button
                    type="button"
                    onClick={() => quitarEspecialidad(id)}
                    className="hover:bg-teal-100 dark:hover:bg-teal-800 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Combo box de especialidades */}
          <div className="relative">
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            {cargandoEspecialidades ? (
              <div className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm">
                Cargando especialidades...
              </div>
            ) : (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    agregarEspecialidad(Number.parseInt(e.target.value))
                    e.target.value = ""
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none"
              >
                <option value="">Agregar especialidad...</option>
                {especialidadesDisponibles
                  .filter((e) => !formData.especialidadesIds.includes(e.id))
                  .map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nombre}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={enviando || isLoading}
          className="flex-1 px-4 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
        >
          {enviando || isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={18} />
              Guardar
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}
