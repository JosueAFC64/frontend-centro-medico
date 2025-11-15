import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user.nombreUsuario.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {user.nombreUsuario}
          </h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">ID</span>
            <span className="text-gray-800">{user.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Usuario</span>
            <span className="text-gray-800">{user.nombreUsuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Cargo</span>
            <span className="text-gray-800">{user.rol}</span>
          </div>
        </div>

        {/* Extra Section for MEDICO */}
        {user.rol === "MEDICO" && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Registrar Disponibilidad
            </h2>
            <button
              type="button"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
            >
              Registrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
