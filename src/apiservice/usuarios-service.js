import axios from 'axios';

const API_URL = 'http://localhost:8080/usuarios'

const UsuariosService = {
    getUserData: async () => {
        try {
            const response = await axios.get(`${API_URL}/session/user-data`, { withCredentials: true });
            console.log("Respuesta completa de getUserData:", response);
            console.log("response.data:", response.data);
            console.log("response.status:", response.status);
            return response.data;
        } catch (error) {
            console.error("Error en UsuariosService.getUserData:", error);
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
            }
            throw new Error('Error getting user in session data: ' + error.message);
        }
    }
}

export default UsuariosService;