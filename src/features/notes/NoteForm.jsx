import { useEffect, useState } from 'react'
import { listUsers } from '../users/usersApi'

export default function NoteForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({ title: '', text: '', user: '', completed: false })
    const [users, setUsers] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const us = await listUsers()
                setUsers(us)
                if (!initial && us.length && !form.user) {
                    setForm(f => ({ ...f, user: us[0]._id || us[0].id }))
                }
            } catch { setUsers([]) }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (initial) {
            setForm({
                title: initial.title || '',
                text: initial.text || '',
                user: initial.user?._id || initial.user || '',
                completed: !!initial.completed
            })
        }
    }, [initial])

    const change = (e) => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    return (
        <form className="grid" onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
            <label>Titolo
                <input name="title" value={form.title} onChange={change} required />
            </label>

            <label>Testo
                <textarea name="text" rows={4} value={form.text} onChange={change} required />
            </label>

            <label>Utente (seleziona ID)
                <select name="user" value={form.user} onChange={change} required>
                    <option value="" disabled>— scegli utente —</option>
                    {users.map(u => (
                        <option key={u._id || u.id} value={u._id || u.id}>
                            {(u.username || 'user') }
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex">
                <input type="checkbox" name="completed" checked={form.completed} onChange={change} />
                Completata
            </label>

            <div className="flex">
                <button type="submit">Salva</button>
                {onCancel && <button type="button" onClick={onCancel}>Annulla</button>}
            </div>
        </form>
    )
}
