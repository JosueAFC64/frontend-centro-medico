import axios from "axios"

const API_URL = "http://localhost:8080/comprobantes"

const comprobantePagoService = {
  generarComprobante: async (idPagoCita, tipoComprobante, dniPaciente) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          idPagoCita,
          tipoComprobante,
          dniPaciente,
        },
        {
          responseType: "blob",
        },
      )
      // Crear un enlace de descarga y trigger automático
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "comprobante-pago.pdf")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
      return response.data
    } catch (error) {
      throw new Error("Error al generar comprobante: " + error.message)
    }
  },
}

export default comprobantePagoService
