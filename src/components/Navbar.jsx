import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import AuthService from "../apiservice/auth-service"
import { Link, useLocation } from "react-router-dom"
import { User, LogOut, ChevronDown, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const { user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      window.location.href = "/login"
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      window.location.href = "/login"
    }
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Panel Principal";
    if (path === "/empleados") return "Gestión de Empleados";
    if (path === "/pago-citas") return "Pagos y Facturación";
    if (path === "/especialidades") return "Especialidades Médicas";
    if (path === "/consultorios") return "Consultorios";
    if (path === "/pacientes") return "Gestión de Pacientes";
    if (path === "/perfil") return "Mi Perfil";
    return "Centro Médico";
  }

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-teal-500/20 outline-none"
            aria-label="Toggle menu"
          >
            <Menu className={`w-6 h-6 transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`} />
          </button>

          <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`
                  flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200
                  border border-transparent hover:border-slate-200 dark:hover:border-slate-700
                  hover:bg-slate-50 dark:hover:bg-slate-800
                  ${isDropdownOpen ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm" : ""}
                `}
              >
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white font-medium shadow-md shadow-teal-500/20 ring-2 ring-white dark:ring-slate-900">
                  {user.nombreUsuario ? user.nombreUsuario.charAt(0).toUpperCase() : "U"}
                </div>

                <div className="hidden md:flex flex-col items-start mr-1">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none mb-1">
                    {user.nombreUsuario || user.nombre || "Usuario"}
                  </span>
                  <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-900/30 px-1.5 py-0.5 rounded-md">
                    {user.rol || "Sin rol"}
                  </span>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Conectado como</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">{user.email || user.nombreUsuario}</p>
                  </div>

                  <div className="px-2 space-y-1">
                    <Link
                      to="/perfil"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-3 group"
                    >
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 group-hover:text-teal-600 group-hover:bg-teal-50 dark:group-hover:bg-slate-700 transition-colors">
                        <User size={16} />
                      </div>
                      Ver perfil
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center gap-3 group"
                    >
                      <div className="p-1.5 bg-red-50 dark:bg-red-900/10 rounded-lg text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                        <LogOut size={16} />
                      </div>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar