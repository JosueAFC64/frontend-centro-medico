import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Briefcase, CalendarPlus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
        <p className="text-slate-500 font-medium">Cargando perfil...</p>
      </div>
    );
  }

  const roleColors = {
    MEDICO: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    ENFERMERA: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
    PERSONAL_ADMINISTRATIVO: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
            <User className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          Mi Perfil
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 ml-14">Información de su cuenta y rol</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center h-full">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-teal-500/20 mb-4">
              {user.nombreUsuario.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {user.nombreUsuario}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{user.email}</p>

            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${roleColors[user.rol] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
              {user.rol}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-teal-500" />
              Información de la Cuenta
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Nombre de Usuario</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{user.nombreUsuario}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Correo Electrónico</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-400">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Rol / Cargo</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{user.rol}</p>
                </div>
              </div>
            </div>

            {/* Extra Section for MEDICO */}
            {user.rol === "MEDICO" && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CalendarPlus size={20} className="text-teal-500" />
                  Acciones Rápidas
                </h3>
                <Link
                  to="/disponibilidades"
                  className="w-full py-3 px-4 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CalendarPlus size={20} />
                  Gestionar Disponibilidad
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
