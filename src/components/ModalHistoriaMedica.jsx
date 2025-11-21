import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import HistoriasService from "../apiservice/historias-service"
import ModalSeccionAtencion from "../components/ModalSeccionAtencion"

export default function ModalHistoriaMedica({ isOpen, onClose, dni, isLoading }) {
  const [formData, setFormData] = useState({
    peso: "",
    talla: "",
    tipoSangre: "",
    alergias: "",
    antecedentesFamiliares: "",
    antecedentesPersonales: "",
  })

  const [historiaMedica, setHistoriaMedica] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [paginaActual, setPaginaActual] = useState(0)

  useEffect(() => {
    if (isOpen && dni) {
      cargarHistoriaMedica()
    }
  }, [isOpen, dni])

  const cargarHistoriaMedica = async () => {
    try {
      const data = await HistoriasService.buscarPorDni(dni)
      setHistoriaMedica(data)
      setFormData({
        peso: data.peso || "",
        talla: data.talla || "",
        tipoSangre: data.tipoSangre || "",
        alergias: data.alergias || "",
        antecedentesFamiliares: data.antecedentesFamiliares || "",
        antecedentesPersonales: data.antecedentesPersonales || "",
      })
    } catch (error) {
      toast.error("No se encontró historia médica")
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setEnviando(true)
      await HistoriasService.actualizarHistoriaMedica(dni, {
        dniPaciente: dni,
        ...formData,
      })
      toast.success("Historia médica actualizada exitosamente")
      onClose()
    } catch (error) {
      toast.error(error.message || "Error al guardar la historia médica")
    } finally {
      setEnviando(false)
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

  const atenciones = historiaMedica?.atenciones || []
  const atencionActual = atenciones[paginaActual]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-white border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Historia Médica</h2>
          {historiaMedica?.paciente && (
            <p className="text-sm text-muted-foreground mt-2">
              {historiaMedica.paciente.nombres} {historiaMedica.paciente.apellidos} | Fecha de Creación: {formatearFecha(historiaMedica.fechaCreacion)}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese peso"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Talla (cm)</label>
                <input
                  type="number"
                  name="talla"
                  value={formData.talla}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese talla"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Sangre</label>
                <select
                  name="tipoSangre"
                  value={formData.tipoSangre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccione tipo de sangre</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Edad</label>
                <input
                  type="number"
                  value={historiaMedica?.edad || ""}
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground disabled:text-foreground/50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Alergias</label>
                <textarea
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese alergias"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Antecedentes Familiares</label>
                <textarea
                  name="antecedentesFamiliares"
                  value={formData.antecedentesFamiliares}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese antecedentes familiares"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Antecedentes Personales</label>
                <textarea
                  name="antecedentesPersonales"
                  value={formData.antecedentesPersonales}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese antecedentes personales"
                  rows="3"
                />
              </div>
            </div>

            <ModalSeccionAtencion
              atencionActual={atencionActual}
              atenciones={atenciones}
              paginaActual={paginaActual}
              setPaginaActual={setPaginaActual}
              formatearFecha={formatearFecha}
            />

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium"
              >
                Volver
              </button>
              <button
                onClick={handleSave}
                disabled={enviando}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {enviando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
