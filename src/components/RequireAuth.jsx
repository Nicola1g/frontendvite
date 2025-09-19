import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

export default function RequireAuth() {
    const { user, loading } = useAuth()
    if (loading) return <Spinner />
    if (!user) return <Navigate to="/login"  />
    return <Outlet />
}
//se loading attivo carica , quando finisce controlla lutente se e giuto outlet senno back