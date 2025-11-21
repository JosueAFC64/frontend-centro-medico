import axios from "axios"

const API_URL = "http://localhost:8080/atenciones-medicas"

const AtencionesService = {
    registrarAtencion: async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error("Error al registrar atención médica:", error);
            throw error;
        }   
    },

    obtenerAtencionPorCita: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener atención médica por cita:", error);
            throw error;
        }
    }
}

export default AtencionesService