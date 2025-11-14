import axios from "axios"

const API_URL = "http://localhost:8080/historias"

const historiasService = {
  buscarPorDni: async (dni) => {
    try {
      const response = await axios.get(`${API_URL}/buscar/${dni}`)
      return response.data
    } catch (error) {
      throw new Error("Error al buscar historia médica: " + error.message)
    }
  },

  registrarHistoriaMedica: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/registrar`, data)
      return response.data
    } catch (error) {
      throw new Error("Error al registrar historia médica: " + error.message)
    }
  },

  actualizarHistoriaMedica: async (dni, data) => {
    try {
      const response = await axios.put(`${API_URL}/actualizar/${dni}`, data)
      return response.data
    } catch (error) {
      throw new Error("Error al actualizar historia médica: " + error.message)
    }
  },
}

export default historiasService
