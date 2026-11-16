import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

// esse serve pra proteger do usuário só por na url "/perfil"
function RotaProtegida({ children }: { children: ReactNode }) {
    const usuario = localStorage.getItem('arbo-usuario')

    if (!usuario) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default RotaProtegida