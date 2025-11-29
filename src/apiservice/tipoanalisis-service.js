import axios from "axios";

const API_URL = "http://localhost:8080/tipo-analisis";

const TipoAnalisisService = {
  registrarTipoAnalisis: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error al registrar tipo de análisis:", error);
      throw error;
    }
  },

  listarTipoAnalisis: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al listar tipos de análisis:", error);
      throw error;
    }
  }
};

export default TipoAnalisisService;