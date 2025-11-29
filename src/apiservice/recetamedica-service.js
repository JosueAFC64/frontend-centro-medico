import axios from "axios";

const API_URL = "http://localhost:8080/recetas";

const RecetaMedicaService = {
  registrarReceta: async (data) => {
    try {
      const response = await axios.post(API_URL, data, {
        responseType: "blob",
      });
      // Crear un enlace de descarga y trigger automático
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "receta-medica.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      return response.data;
    } catch (error) {
      throw new Error("Error al registrar receta médica: " + error.message);
    }
  },

  buscarRecetaPorIdAtencion: async (idAtencion) => {
    try {
      const response = await axios.get(`${API_URL}/feign/${idAtencion}`);
      return response.data;
    } catch (error) {
      throw new Error("Error al buscar receta médica: " + error.message);
    }
  },
};

export default RecetaMedicaService;
