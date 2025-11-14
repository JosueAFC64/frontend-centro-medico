import React from "react"

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
import "./App.css"

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <Router>
      <div className="flex h-screen relative bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "md:ml-0" : "md:ml-0" // Esto se mantiene igual si usas flex
          }`}>
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
          <main className={`flex-1 overflow-auto bg-background p-6 sidebar-content-transition`}>
            <Routes>
              <Route path="/" element={<Especialidades />} />
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/consultorios" element={<Consultorios />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/disponibilidades" element={<Disponibilidades />} />
              <Route path="/horarios" element={<Horarios />} />
              <Route path="/pago-citas" element={<PagoCitas />} />
            </Routes>
          </main>
        </div>
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

export default App
