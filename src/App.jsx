import React from "react"

import { Navigate } from "react-router-dom"
import { useAuth, AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Especialidades from "./pages/Especialidades"
import Empleados from "./pages/Empleados"
import Consultorios from "./pages/Consultorios"
import Pacientes from "./pages/Pacientes"
import Disponibilidades from "./pages/Disponibilidades"
import Horarios from "./pages/Horarios"
import PagoCitas from "./pages/PagoCitas"
import Login from "./pages/Login"
import "./App.css"

function ProtectedRoute({ children, allowedRoles, showNavbarSidebar = true, sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  if (!showNavbarSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <Router>
      <div className="flex h-screen relative bg-background">
        <Routes>
          <Route 
            path="/login" 
            element={<Login />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute 
                allowedRoles={["MEDICO", "ENFERMERA", "PERSONAL_ADMINISTRATIVO"]}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              >
                <Especialidades />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/empleados" 
            element={
              <ProtectedRoute 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              >
                <Empleados />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/consultorios" 
            element={
              <ProtectedRoute 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              >
                <Consultorios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pacientes" 
            element={
              <ProtectedRoute 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              >
                <Pacientes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/disponibilidades" 
            element={
              <ProtectedRoute 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              >
                <Disponibilidades />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/horarios" 
            element={
              <ProtectedRoute 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              >
                <Horarios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pago-citas" 
            element={
              <ProtectedRoute 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              >
                <PagoCitas />
              </ProtectedRoute>
            } 
          />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
