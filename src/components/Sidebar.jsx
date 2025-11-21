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
      { path: "/", label: "Horarios", icon:  <RiCalendarScheduleFill /> },
      { path: "/empleados", label: "Empleados", icon: <FaUserDoctor /> },
      { path: "/pago-citas", label: "Pagos", icon: <FaCreditCard /> },
      { path: "/especialidades", label: "Especialidades", icon: <FaHeartPulse /> },
      { path: "/consultorios", label: "Consultorios", icon: <PiOfficeChairFill /> },
    ],
    ENFERMERA: [
      { path: "/", label: "Pacientes", icon: <MdSick /> },
    ],
    MEDICO: [
      { path: "/", label: "Horarios", icon:  <RiCalendarScheduleFill /> },
    ],
  }

  const menuItems = menusByRol[user.rol] || []

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20 overlay-transition"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative 
        top-0 left-0 h-screen md:h-full
        bg-white border-r border-border 
        z-30 sidebar-transition sidebar-fixed
        shrink-0
        ${isOpen
            ? "translate-x-0 w-64 md:w-64 md:min-w-64"
            : "-translate-x-full md:translate-x-0 md:w-20 md:min-w-20"
          }
      `}
      >
        {/* Header del sidebar */}
        <div className={`border-b border-border md:flex md:items-center md:justify-between ${isOpen ? "p-5" : "p-6"}`}>
          {isOpen ? (
            <h2 className="text-lg font-semibold text-foreground sidebar-content-transition">
              Menú
            </h2>
          ) : (
            <div className="hidden md:flex justify-center w-full">
              <span className="text-sm font-semibold text-foreground">Menú</span>
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
              flex items-center ${isOpen ? "gap-3 " : ""} 
              px-4 py-3 rounded-lg 
              sidebar-content-transition
              group relative
              ${location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }
              ${!isOpen ? "md:justify-center md:px-3" : ""}
            `}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span
                className={`
                font-medium sidebar-content-transition
                ${!isOpen
                    ? "md:opacity-0 md:max-w-0 md:overflow-hidden"
                    : "md:opacity-100 md:max-w-full"
                  }
              `}
              >
                {item.label}
              </span>

              {/* Tooltip para cuando está colapsado */}
              {!isOpen && (
                <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-40">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
