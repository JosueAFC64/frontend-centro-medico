export default function Navbar({ onMenuClick, sidebarOpen }) {
  return (
    <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
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
        <div className="text-sm text-muted-foreground">Sistema de Gestión</div>
      </div>
    </nav>
  )
}
