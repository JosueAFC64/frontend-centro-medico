import axios from "axios";

const API_URL = "http://localhost:8080/especialidades";

const especialidadesService = {
    registrarEspecialidad: async (nombre, costo) => {
        try {
            const response = await axios.post(API_URL, { nombre, costo });
            return response.data;
        } catch (error) {
            console.error("Error al registrar especialidad:", error);
            throw error;
        }
    },

    listarEspecialidades: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al listar especialidades:", error);
            throw error;
        }
    },

    eliminarEspecialidad: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar especialidad:", error);
            throw error;
        }
    }
}

export default especialidadesService;
