import axios from "axios"

const API_URL = "http://localhost:8080/pacientes"

const pacientesService = {
  listarPacientes: async () => {
    try {
      const response = await axios.get(`${API_URL}/listar`)
      return response.data
    } catch (error) {
      throw new Error("Error al listar pacientes: " + error.message)
    }
  },

  buscarPorDni: async (dni) => {
    try {
      const response = await axios.get(`${API_URL}/buscar/dni/${dni}`)
      return response.data
    } catch (error) {
      throw new Error("Error al buscar paciente: " + error.message)
    }
  },

  registrarPaciente: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/registrar`, data)
      return response.data
    } catch (error) {
      throw new Error("Error al registrar paciente: " + error.message)
    }
  },

  actualizarPaciente: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data)
      return response.data
    } catch (error) {
      throw new Error("Error al actualizar paciente: " + error.message)
    }
  },

  eliminarPaciente: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/eliminar/${id}`)
      return response.data
    } catch (error) {
      throw new Error("Error al eliminar paciente: " + error.message)
    }
  },
}

export default pacientesService
