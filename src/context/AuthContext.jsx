import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchMe = useCallback(async () => {
        try {
            console.log('[Auth] GET /auth/me...')
            const { data } = await api.get('/auth/me') // deve restituire l'utente corrente
            console.log('[Auth] /auth/me OK', data)
            setUser(data?.user || data || null)
        } catch {
            console.log('[Auth] /auth/me 401')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchMe() }, [fetchMe])

    const login = async (credentials) => {
        console.log('[Auth] POST /auth/login...', credentials)
        const r = await api.post('/auth/login', credentials) // { username, password }
        console.log('[Auth] /auth/login status', r.status)
        await fetchMe()
    }

    const logout = async () => {
        try { await api.post('/auth/logout') } catch {}
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
