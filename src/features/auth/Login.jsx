import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Alert from '../../components/Alert' // se non l'hai creato, togli questa riga e il componente sotto




export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dash'
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [showPwd, setShowPwd] = useState(false)


    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            await login(form)            // ⬅️ chiama il backend /auth/login
            navigate(from, { replace: true })
        } catch (err) {
            setError(err?.response?.data?.message || 'Credenziali non valide')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-[60vh] grid place-items-center">
            <div className="w-full max-w-md card">
                <h1 className="text-2xl font-semibold mb-1">Accedi</h1>
                <p className="small mb-4">Entra con le tue credenziali</p>

                <form className="grid gap-4" onSubmit={onSubmit}>
                    <label>
                        <span>Username</span>
                        <input
                            className="input-dark"
                            name="username"
                            value={form.username}
                            onChange={change}
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label>
                        <span>Password</span>
                        <div className="relative">
                            <input
                                style={{ backgroundColor: '#0b1220', color: '#e5e7eb' }}
                                className="input-dark pr-10  [color-scheme:dark]"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={change}
                                autoComplete="current-password"
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(s => !s)}
                                aria-label={showPwd ? 'Nascondi password' : 'Mostra password'}
                                className="absolute inset-y-0 right-2 my-auto text-slate-400 hover:text-slate-200"
                            >
                                {showPwd ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </label>


                    {error ? (
                        <Alert>{error}</Alert>
                    ) : null}

                    <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                        {submitting ? 'Accesso…' : 'Entra'}
                    </button>
                </form>
            </div>
        </div>
    )
}
