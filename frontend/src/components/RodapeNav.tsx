
import './RodapeNav.css'
import { NavLink } from 'react-router-dom'

function RodapeNav() {
  return (
    <nav className="navegacao-inferior">

      <NavLink to="/mapa" className={({ isActive }) => isActive ? 'item-ativo' : ''}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
        <span>Mapa</span>
      </NavLink>

      <NavLink to="/ongs" className={({ isActive }) => isActive ? 'item-ativo' : ''}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>ONGs</span>
      </NavLink>

      <NavLink to="/perfil" className={({ isActive }) => isActive ? 'item-ativo' : ''}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-2a8 8 0 0 1 16 0v2z" />
        </svg>
        <span>Perfil</span>
      </NavLink>

    </nav>
  )
}

export default RodapeNav
