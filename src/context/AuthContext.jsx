import { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../apiservice/auth-service";
import UsuariosService from "../apiservice/usuarios-service";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      console.log("Respuesta del login:", response);

      // Si el backend responde exitosamente (status 200), la respuesta existe
      // Incluso si es un objeto vacío, consideramos el login exitoso
      if (response !== undefined && response !== null) {
        // Esperar un momento para que las cookies se establezcan
        await new Promise(resolve => setTimeout(resolve, 200));
        
        try {
          await fetchUserData();
          return true;
        } catch (fetchError) {
          // Si fetchUserData falla, aún consideramos el login exitoso
          // porque el backend ya autenticó al usuario
          console.warn("Login exitoso pero error al obtener datos del usuario:", fetchError);
          return true;
        }
      }
      console.warn("Login: respuesta vacía o inválida");
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      // Si el error tiene respuesta del servidor, mostrarlo
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      return false;
    }
  };

  const fetchUserData = async () => {
    try {
      const data = await UsuariosService.getUserData();
      console.log("Datos del usuario obtenidos:", data);
      console.log("Tipo de datos:", typeof data);
      console.log("Es objeto?:", typeof data === 'object' && data !== null);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setUser(null);
      setLoading(false);
      throw error; // Re-lanzar el error para que el login pueda manejarlo
    }
  };

  useEffect(() => {
    const publicRoutes = ["/login"];
    const currentPath = window.location.pathname;

    if (!publicRoutes.includes(currentPath)) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login,
    userId: user ? user.id : null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
