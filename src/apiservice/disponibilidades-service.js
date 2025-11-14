import axios from "axios"

const API_URL = "http://localhost:8080/disponibilidades"

const disponibilidadesService = {
  listarDisponibilidades: async () => {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      throw new Error("Error al listar disponibilidades: " + error.message)
    }
  },

  registrarDisponibilidad: async (data) => {
    try {
      const response = await axios.post(API_URL, data)
      return response.data
    } catch (error) {
      throw new Error("Error al registrar disponibilidad: " + error.message)
    }
  },

  eliminarDisponibilidad: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      throw new Error("Error al eliminar disponibilidad: " + error.message)
    }
  },
}

export default disponibilidadesService
