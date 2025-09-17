import { useEffect, useState } from 'react'
import { listUsers, createUser, updateUser, deleteUserById } from './usersApi'
import UserForm from './UserForm'
import Alert from '../../components/Alert.jsx'

export default function UsersList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(null)

    // Filtri + paginazione
    const [query, setQuery] = useState('')
    const [onlyActive, setOnlyActive] = useState(false)
    const [page, setPage] = useState(1)
    const pageSize = 5

    const load = async () => {
        setLoading(true); setError('')
        try { setUsers(await listUsers()) }
        catch { setError('Errore nel caricamento utenti') }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const onCreate = async (payload) => {
        try {
            await createUser(payload)
            setPage(1)        // torna alla prima pagina
            await load()
            setQuery('')
            setOnlyActive(false)
        } catch (e) {
            alert(e?.response?.data?.message || 'Errore creazione')
        }
    }

    const onUpdate = async (id, payload) => {
        try { await updateUser(id, payload); setEditing(null); await load() }
        catch (e) { alert(e?.response?.data?.message || 'Errore aggiornamento') }
    }

    const onDelete = async (id) => {
        if (!confirm('Eliminare l\'utente?')) return
        try { await deleteUserById(id); await load() }
        catch (e) { alert(e?.response?.data?.message || 'Errore eliminazione') }
    }

    // Filtri
    const q = query.trim().toLowerCase()
    const filtered = users.filter(u => {
        const okQ = !q || u.username?.toLowerCase().includes(q)
        const okActive = !onlyActive || !!u.active
        return okQ && okActive
    })

    // Paginazione
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
    useEffect(() => { setPage(1) }, [query, onlyActive])

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

            {/* ===== ELENCO sotto ===== */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-lg font-medium">Elenco utenti</h3>
                    <div className="flex items-center gap-3">
                        <input
                            type="search"
                            className="input-dark [color-scheme:dark]"
                            placeholder="Cerca username…"
                            value={query}
                            onChange={e=>setQuery(e.target.value)}
                            style={{ backgroundColor: '#0b1220', color: '#e5e7eb', maxWidth: 300 }}
                        />
                        <label className="flex items-center gap-2 small">
                            <input
                                type="checkbox"
                                checked={onlyActive}
                                onChange={e=>setOnlyActive(e.target.checked)}
                            />
                            Solo attivi
                        </label>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto overflow-x-hidden max-h-[60vh]">
                    {loading ? (
                        <div>Caricamento…</div>
                    ) : error ? (
                        <Alert>{error}</Alert>
                    ) : (
                        <>
                            {/* Tabella pulita come in Welcome */}
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
                                {pageItems.map(u => (
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

                            <div className="flex items-center justify-between mt-2">
                                <div className="small">{filtered.length} utenti · pagina {safePage}/{totalPages}</div>
                                <div className="flex gap-2">
                                    <button disabled={safePage<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>← Prev</button>
                                    <button disabled={safePage>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages, p+1))}>Next →</button>
                                </div>
                            </div>
                        </>
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
