import { useEffect, useState } from 'react'
import { listUsers, createUser, updateUser, deleteUserById } from './usersApi'
import UserForm from './UserForm'

export default function UsersList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(null)

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const us = await listUsers()
            setUsers(us)
        } catch {
            setError('Errore nel caricamento utenti')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const onCreate = async (payload) => {
        try {
            await createUser(payload)
            await load()
        } catch (e) {
            alert(e?.response?.data?.message || 'Errore creazione')
        }
    }

    const onUpdate = async (id, payload) => {
        try {
            await updateUser(id, payload)
            setEditing(null)
            await load()
        } catch (e) {
            alert(e?.response?.data?.message || 'Errore aggiornamento')
        }
    }

    const onDelete = async (id) => {
        if (!confirm('Eliminare l\'utente?')) return
        try {
            await deleteUserById(id)
            await load()
        } catch (e) {
            alert(e?.response?.data?.message || 'Errore eliminazione')
        }
    }

    return (
        <div className="grid gap-6">
            <h2 className="text-xl font-semibold">Users</h2>

            {/* ===== FORM sopra ===== */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800">
                    <h3 className="text-lg font-medium">Crea nuovo utente</h3>
                </div>
                <div className="p-5">
                    <div className="max-w-3xl mx-auto">
                        <UserForm onSubmit={onCreate} />
                    </div>
                </div>
            </div>

            {/* ===== ELENCO sotto (senza ricerca/paginazione/filtri) ===== */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800">
                    <h3 className="text-lg font-medium">Elenco utenti</h3>
                </div>

                <div className="p-5 overflow-y-auto overflow-x-hidden max-h-[70vh]">
                    {loading ? (
                        <div>Caricamento…</div>
                    ) : error ? (
                        <div className="rounded-lg border border-red-300/40 bg-red-900/40 px-3 py-2 text-sm">{error}</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="text-slate-400">
                            <tr>
                                <th className="text-left font-medium">Username</th>
                                <th className="text-left font-medium hidden md:table-cell">Ruolo</th>
                                <th className="text-left font-medium">Attivo</th>
                                <th className="text-left font-medium">Azioni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(u => (
                                <tr key={u._id || u.id} className="border-t border-slate-800/60">
                                    <td className="py-2 pr-2 truncate" title={u.username}>{u.username}</td>
                                    <td className="py-2 pr-2 hidden md:table-cell truncate" title={Array.isArray(u.roles) ? (u.roles[0] || '') : String(u.roles || '')}>
                                        {Array.isArray(u.roles) ? (u.roles[0] || '') : String(u.roles || '')}
                                    </td>
                                    <td className="py-2 pr-2">{u.active ? '✅' : '❌'}</td>
                                    <td className="py-2">
                                        <div className="inline-flex gap-2">
                                            <button onClick={() => setEditing(u)}>Modifica</button>
                                            <button onClick={() => onDelete(u._id || u.id)}>Elimina</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ===== MODIFICA ===== */}
            {editing && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800">
                        <h3 className="text-lg font-medium">Modifica utente</h3>
                    </div>
                    <div className="p-5">
                        <div className="max-w-3xl mx-auto">
                            <UserForm
                                initial={editing}
                                onSubmit={(payload) => onUpdate(editing._id || editing.id, payload)}
                                onCancel={() => setEditing(null)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
