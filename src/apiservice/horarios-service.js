import axios from "axios"

const API_URL = "http://localhost:8080/horarios"

const horariosService = {
  listarHorarios: async () => {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      throw new Error("Error al listar horarios: " + error.message)
    }
  },

  registrarHorario: async (data) => {
    try {
      const response = await axios.post(API_URL, data)
      return response.data
    } catch (error) {
      throw new Error("Error al registrar horario: " + error.message)
    }
  },
}

export default horariosService
