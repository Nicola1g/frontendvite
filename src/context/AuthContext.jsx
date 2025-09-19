import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios'


{/*auth context = scatola globale
authprovider = popolatore della scaola
useauth da a tutti i componenti laccesso ai valori della scatola globale
*/}





const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    {/*callback perche fetchme  non cambia ogni rirerender ma solo se smonot e rimonto authprovider  */}
    const fetchMe = useCallback(async () => {
        try {
            console.log('[Auth] GET /auth/me...')
            const { data } = await api.get('/auth/me') // deve restituire l'utente corrente
            console.log('[Auth] /auth/me OK', data)
            setUser(data?.user || data || null)   //datauser se ce , senno prova con data oggetto intero senno null
        } catch {
            console.log('[Auth] /auth/me 401')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    {/*use effect esegue qualcosa callback mantiene stabile una funzionen
   le quadre per chiudere quando hai valori stabili di user e loading  */}


    useEffect(() => { fetchMe() }, [fetchMe])


    {/*quando react starta la pagina parte dopo il paint , solo se authprovider e smontato riparte */}

    {/*credentials da login , e chiama il backend con axios , partono quando le chiamo io  */}
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

    {/*ogni componente figlio ha i valori user loading login e logout */}

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
