import axios from "axios"

const API_URL = "http://localhost:8080/pago-cita"

const pagoCitasService = {
  buscarPorDni: async (dniPaciente) => {
    try {
      const response = await axios.get(`${API_URL}/${dniPaciente}`)
      return response.data
    } catch (error) {
      throw new Error("Error al buscar pagos: " + error.message)
    }
  },
}

export default pagoCitasService
