import axios from "axios"

const API_URL = "http://localhost:8080/citas-medicas"

const citasMedicasService = {
  registrarCitaMedica: async (data) => {
    try {
      const response = await axios.post(
        API_URL, 
        data,
        {
          responseType: "blob",
        },
      )
      // Crear un enlace de descarga y trigger automático
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "cita-medica.pdf")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
      return response.data
    } catch (error) {
      throw new Error("Error al registrar cita médica: " + error.message)
    }
  },

  cancelarCita: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/cancelar/${id}`)
      return response.data
    } catch (error) {
      throw new Error("Error al cancelar cita: " + error.message)
    }
  },

  completarCita: async (id) => {
    try {
      await axios.patch(`${API_URL}/completar/${id}`, null)
    } catch (error) {
      throw new Error("Error al completar cita: " + error.message)
    }
  },
}

export default citasMedicasService
