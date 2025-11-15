import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'

const AuthService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            console.error('Error en AuthService.login:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/logout`, null, { 
                withCredentials: true 
            });
        } catch (error) {
            console.error('Error en AuthService.logout:', error);
            throw error;
        }
    }
}

export default AuthService;