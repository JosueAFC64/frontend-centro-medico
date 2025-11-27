import axios from "axios";

const API_URL = "http://localhost:8080/empleados";

const empleadosService = {
    registrarEmpleado: async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error("Error al registrar empleado:", error);
            throw error;
        }
    },

    listarEmpleados: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al listar empleados:", error);
            throw error;
        }
    
    },

    listarMedicos: async () => {
        try {
            const response = await axios.get(`${API_URL}/medicos`);
            return response.data;
        } catch (error) {
            console.error("Error al listar médicos:", error);
            throw error;
        }
    },

    buscarPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al buscar empleado por ID:", error);
            throw error;
        }
    },

    actualizarEmpleado: async (id, data) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}`, data)
            return response.data
        } catch (error) {
            throw new Error("Error al actualizar empleado: " + error.message)
        }
    },

    eliminarEmpleado: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar empleado:", error);
            throw error;
        }
    }
}

export default empleadosService;
