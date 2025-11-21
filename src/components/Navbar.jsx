import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import AuthService from "../apiservice/auth-service"
import { Link } from "react-router-dom"
import { User, LogOut } from 'lucide-react';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const { user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

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
      // Redirigir igualmente en caso de error
      window.location.href = "/login"
    }
  }

  return (
    <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-30">
      <div className="px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-accent rounded-lg transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-transform ${sidebarOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-primary">Centro Médico</h1>
        </div>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {user.nombreUsuario || user.nombre || "Usuario"}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.rol || "Sin rol"}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
                <Link
                  to="/perfil"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <User size={20}/>
                  Ver perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={20}/>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar