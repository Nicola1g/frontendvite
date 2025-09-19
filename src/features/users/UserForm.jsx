import { useEffect, useState } from 'react'

const ROLES = ['Employee', 'Manager', 'Admin']

export default function UserForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'Employee', // singolo ruolo selezionato
        active: true
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [showPwd, setShowPwd] = useState(false)
    // Carica valori in modifica
    useEffect(() => {
        if (initial) {
            const onlyRole =
                (Array.isArray(initial.roles) ? initial.roles[0] : initial.role) || 'Employee'
            setForm({
                username: initial.username || '',
                password: '',
                role: onlyRole,
                active: initial.active !== undefined ? !!initial.active : true
            })
        }
    }, [initial])

   // Unico handler per tutti gli input:
    const change = (e) => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    const validate = () => {
        const e = {}
        if (!form.username || form.username.trim().length < 3) e.username = 'Minimo 3 caratteri'
        if (!initial && (!form.password || form.password.length < 4)) e.password = 'Minimo 4 caratteri'
        if (!form.role || !ROLES.includes(form.role)) e.role = 'Seleziona un ruolo valido'
        setErrors(e)
        return Object.keys(e).length === 0
    }
//normalizza i dati per lapi
    const toPayload = () => ({
        username: form.username.trim(),
        ...(form.password ? { password: form.password } : {}),
        roles: [form.role],      // ✅ il backend riceve sempre un array con un solo ruolo
        active: !!form.active
    })

    const submit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setSubmitting(true)
        try {
            await onSubmit(toPayload())
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="grid" onSubmit={submit}>
            <label>Username
                <input className="input-dark" name="username" value={form.username} onChange={change} required />
            </label>
            {errors.username && <div className="small" style={{ color:'#fca5a5' }}>{errors.username}</div>}

            <label>
                <span>Password {initial ? '(lascia vuoto per non cambiare)' : ''}</span>
                <div className="relative">
                    <input
                        style={{ backgroundColor: '#0b1220', color: '#e5e7eb' }}
                        className="input-dark pr-10"
                        type={showPwd ? 'text' : 'pas  [color-scheme:dark]sword'}
                        name="password"
                        value={form.password}
                        onChange={change}
                        {...(!initial ? { required: false } : {})}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPwd(s => !s)}
                        aria-label={showPwd ? 'Nascondi password' : 'Mostra password'}
                        className="absolute inset-y-0 right-2 my-auto text-slate-400 hover:text-slate-200"
                    >
                        {showPwd ? 'mostra' : 'non mostrare'}
                    </button>
                </div>
            </label>

            {!initial && errors.password && <div className="small" style={{ color:'#fca5a5' }}>{errors.password}</div>}

            <label>Ruolo
                <select name="role" value={form.role} onChange={change} required>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </label>
            {errors.role && <div className="small" style={{ color:'#fca5a5' }}>{errors.role}</div>}

            <label className="flex" style={{ gap:8 }}>
                <input type="checkbox" name="active" checked={form.active} onChange={change} />
                Attivo
            </label>

            <div className="flex">
                <button type="submit" disabled={submitting}>{submitting ? 'Salvo…' : 'Salva'}</button>
                {onCancel && <button type="button" onClick={onCancel}>Annulla</button>}
            </div>
        </form>
    )
}
