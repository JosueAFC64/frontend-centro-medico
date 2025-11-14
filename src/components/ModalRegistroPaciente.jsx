import { useState } from "react"
import { toast } from "react-toastify"
import PacientesService from "../apiservice/pacientes-service"
import HistoriasService from "../apiservice/historias-service"

export default function ModalRegistroPaciente({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    correo: "",
    fechaNacimiento: "",
    telefonoEmergencia: "",
    contactoEmergencia: "",
    direccion: "",
    peso: "",
    talla: "",
    tipoSangre: "",
    alergias: "",
    antecedentesFamiliares: "",
    antecedentesPersonales: "",
  })

  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegistrar = async () => {
    // Validar campos requeridos
    if (
      !formData.nombres.trim() ||
      !formData.apellidos.trim() ||
      !formData.dni.trim() ||
      !formData.peso ||
      !formData.talla ||
      !formData.tipoSangre
    ) {
      toast.warning("Por favor complete los campos requeridos")
      return
    }

    try {
      setEnviando(true)

      // Registrar paciente
      const dataPaciente = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        telefono: formData.telefono,
        correo: formData.correo,
        fechaNacimiento: formData.fechaNacimiento,
        telefonoEmergencia: formData.telefonoEmergencia,
        contactoEmergencia: formData.contactoEmergencia,
        direccion: formData.direccion,
      }

      const pacienteRegistrado = await PacientesService.registrarPaciente(dataPaciente)
      toast.success("Paciente registrado exitosamente")

      // Registrar historia médica
      const dataHistoria = {
        dniPaciente: formData.dni,
        peso: formData.peso,
        talla: formData.talla,
        tipoSangre: formData.tipoSangre,
        alergias: formData.alergias,
        antecedentesFamiliares: formData.antecedentesFamiliares,
        antecedentesPersonales: formData.antecedentesPersonales,
      }

      await HistoriasService.registrarHistoriaMedica(dataHistoria)
      toast.success("Historia médica registrada exitosamente")

      onSave()
      onClose()
      setFormData({
        nombres: "",
        apellidos: "",
        dni: "",
        telefono: "",
        correo: "",
        fechaNacimiento: "",
        telefonoEmergencia: "",
        contactoEmergencia: "",
        direccion: "",
        peso: "",
        talla: "",
        tipoSangre: "",
        alergias: "",
        antecedentesFamiliares: "",
        antecedentesPersonales: "",
      })
    } catch (error) {
      toast.error(error.message || "Error al registrar paciente y su historia médica")
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-white border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Registrar Paciente</h2>
          <p className="text-sm text-muted-foreground mt-2">Ingrese los datos del paciente y su historia médica</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese nombres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese apellidos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  DNI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese DNI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese teléfono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese correo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Teléfono de Emergencia</label>
                <input
                  type="text"
                  name="telefonoEmergencia"
                  value={formData.telefonoEmergencia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese teléfono de emergencia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contacto de Emergencia</label>
                <input
                  type="text"
                  name="contactoEmergencia"
                  value={formData.contactoEmergencia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nombre de contacto"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese dirección"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Historia Médica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Talla (cm) <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Sangre <span className="text-red-500">*</span>
                </label>
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Alergias</label>
                <textarea
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese alergias"
                  rows="2"
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
                  rows="2"
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
                  rows="2"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleRegistrar}
              disabled={enviando}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {enviando ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
