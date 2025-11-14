import axios from "axios";

const API_URL = "http://localhost:8080/consultorios";

const consultoriosService = {
    registrarConsultorio: async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error("Error al registrar consultorio:", error);
            throw error;
        }
    },

    listarConsultorios: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al listar consultorios:", error);
            throw error;
        }
    
    },

    eliminarConsultorio: async (nro_consultorio) => {
        try {
            const response = await axios.delete(`${API_URL}/${nro_consultorio}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar consultorio:", error);
            throw error;
        }
    }
}

export default consultoriosService;