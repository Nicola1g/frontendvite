import { useEffect, useState } from 'react'
import { listNotes, createNote, updateNote, deleteNoteById } from './notesApi'
import NoteForm from './NoteForm'
import { listUsers } from '../users/usersApi'

export default function NotesList() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(null)
    const [userMap, setUserMap] = useState({})

    // Filtri + paginazione
    const [query, setQuery] = useState('')
    const [onlyCompleted, setOnlyCompleted] = useState(false)
    const [page, setPage] = useState(1)
    const pageSize = 5

    const load = async () => {
        setLoading(true); setError('')
        try {
            const [us, ns] = await Promise.all([
                listUsers().catch(() => []),
                listNotes()
            ])
            const map = Object.fromEntries(
                us.map(u => [u._id || u.id, u.username || String(u._id || u.id)])
            )
            setUserMap(map)
            setNotes(ns)
        } catch {
            setError('Errore nel caricamento note')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const onCreate = async (payload) => {
        try {
            await createNote(payload)
            setPage(1)               // torna alla prima pagina
            await load()
            setQuery('')
            setOnlyCompleted(false)
        } catch {
            alert('Errore creazione')
        }
    }

    const onUpdate = async (id, payload) => {
        try { await updateNote(id, payload); setEditing(null); await load() }
        catch (e) { alert(e?.response?.data?.message || 'Errore aggiornamento') }
    }

    const onDelete = async (id) => {
        if (!confirm('Eliminare la nota?')) return
        try { await deleteNoteById(id); await load() }
        catch { alert('Errore eliminazione') }
    }

    // Filtri client-side
    const q = query.trim().toLowerCase()
    const filtered = notes.filter(n => {
        const okQ = !q || n.title?.toLowerCase().includes(q) || n.text?.toLowerCase().includes(q)
        const okCompleted = !onlyCompleted || n.completed
        return okQ && okCompleted
    })

    // Paginazione
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
    useEffect(() => { setPage(1) }, [query, onlyCompleted])

    return (
        <div className="grid gap-6">
            <h2 className="text-xl font-semibold">Notes</h2>

            {/* ===== FORM sopra ===== */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800">
                    <h3 className="text-lg font-medium">Crea nuova nota</h3>
                </div>
                <div className="p-5">
                    <div className="max-w-3xl mx-auto">
                        <NoteForm onSubmit={onCreate} />
                    </div>
                </div>
            </div>

            {/* ===== ELENCO sotto ===== */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-lg font-medium">Elenco note</h3>
                    <div className="flex items-center gap-3">
                        <input
                            type="search"
                            className="input-dark [color-scheme:dark]"
                            placeholder="Cerca per titolo o testo…"
                            value={query}
                            onChange={(e)=>setQuery(e.target.value)}
                            style={{ backgroundColor: '#0b1220', color: '#e5e7eb', maxWidth: 360 }}
                        />
                        <label className="flex items-center gap-2 small">
                            <input
                                type="checkbox"
                                checked={onlyCompleted}
                                onChange={e=>setOnlyCompleted(e.target.checked)}
                            />
                            Solo completate
                        </label>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto overflow-x-hidden max-h-[60vh]">
                    {loading ? (
                        <div>Caricamento…</div>
                    ) : error ? (
                        <div className="rounded-lg border border-red-300/40 bg-red-900/40 px-3 py-2 text-sm">{error}</div>
                    ) : (
                        <>
                            {/* Tabella pulita come in Welcome */}
                            <table className="w-full text-sm">
                                <thead className="text-slate-400">
                                <tr>
                                    <th className="text-left font-medium">Titolo</th>
                                    <th className="text-left font-medium hidden md:table-cell">Assegnata a</th>
                                    <th className="text-left font-medium">Stato</th>
                                    <th className="text-left font-medium">Azioni</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageItems.map(n => {
                                    const uid = (n.user && n.user._id) ? n.user._id : n.user
                                    const assigned = userMap[uid] || (uid ? String(uid) : '—')
                                    const title = n.title || '(senza titolo)'
                                    return (
                                        <tr key={n._id || n.id} className="border-t border-slate-800/60">
                                            <td className="py-2 pr-2 truncate" title={title}>{title}</td>
                                            <td className="py-2 pr-2 hidden md:table-cell">
                                                <span className="badge truncate">{assigned}</span>
                                            </td>
                                            <td className="py-2 pr-2">{n.completed ? '✅ Completata' : '⏳ Aperta'}</td>
                                            <td className="py-2">
                                                <div className="inline-flex gap-2">
                                                    <button title={n.text} onClick={() => setEditing(n)}>Apri</button>
                                                    <button onClick={() => onDelete(n._id || n.id)}>Elimina</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>

                            <div className="flex items-center justify-between mt-2">
                                <div className="small">{filtered.length} note · pagina {safePage}/{totalPages}</div>
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
                        <h3 className="text-lg font-medium">Modifica nota</h3>
                    </div>
                    <div className="p-5">
                        <div className="max-w-3xl mx-auto">
                            <NoteForm
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
