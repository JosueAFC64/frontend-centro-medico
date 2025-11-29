import axios from "axios";

const API_URL = "http://localhost:8080/medicamentos";

const MedicamentosService = {
  registrarMedicamento: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      throw new Error("Error al registrar medicamento: " + error.message);
    }
  },

  listarMedicamentos: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error("Error al listar medicamentos: " + error.message);
    }
  }
};

export default MedicamentosService;