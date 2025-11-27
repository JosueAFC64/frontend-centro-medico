import { useLocation, Link } from "react-router-dom"
import { FaHeartPulse } from "react-icons/fa6"
import { FaUserDoctor } from "react-icons/fa6"
import { PiOfficeChairFill } from "react-icons/pi"
import { MdSick } from "react-icons/md"
import { RiCalendarScheduleFill } from "react-icons/ri"
import { FaCreditCard } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { user } = useAuth()

  const menusByRol = {
    PERSONAL_ADMINISTRATIVO: [
      { path: "/", label: "Horarios", icon: <RiCalendarScheduleFill /> },
      { path: "/empleados", label: "Empleados", icon: <FaUserDoctor /> },
      { path: "/pago-citas", label: "Pagos", icon: <FaCreditCard /> },
      { path: "/especialidades", label: "Especialidades", icon: <FaHeartPulse /> },
      { path: "/consultorios", label: "Consultorios", icon: <PiOfficeChairFill /> },
    ],
    ENFERMERA: [
      { path: "/", label: "Pacientes", icon: <MdSick /> },
    ],
    MEDICO: [
      { path: "/", label: "Horarios", icon: <RiCalendarScheduleFill /> },
    ],
  }

  const menuItems = menusByRol[user.rol] || []

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm md:hidden z-40 overlay-transition"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative 
        top-0 left-0 h-screen md:h-full
        bg-white/90 dark:bg-slate-900/90 backdrop-blur-md
        border-r border-slate-200 dark:border-slate-800
        z-50 sidebar-transition sidebar-fixed
        shrink-0 shadow-xl md:shadow-none
        ${isOpen
            ? "translate-x-0 w-72 md:w-72 md:min-w-72"
            : "-translate-x-full md:translate-x-0 md:w-20 md:min-w-20"
          }
      `}
      >
        {/* Header del sidebar */}
        <div className={`h-20 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 ${isOpen ? "px-6" : "px-0 justify-center"}`}>
          {isOpen ? (
            <div className="flex items-center gap-3 sidebar-content-transition">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
                CM
              </div>
              <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
                Centro Médico
              </h2>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/20">
              C
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                flex items-center ${isOpen ? "gap-4" : "justify-center"} 
                px-4 py-3.5 rounded-xl
                sidebar-content-transition
                group relative
                transition-all duration-300 ease-out
                ${isActive
                    ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  }
              `}
              >
                <span className={`text-xl shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>

                <span
                  className={`
                  font-medium whitespace-nowrap sidebar-content-transition
                  ${!isOpen
                      ? "hidden"
                      : "block"
                    }
                `}
                >
                  {item.label}
                </span>

                {/* Active Indicator Strip */}
                {isActive && isOpen && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-l-full" />
                )}

                {/* Tooltip para cuando está colapsado */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                    {/* Arrow */}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer decoration */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                © 2025 Centro Médico
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

