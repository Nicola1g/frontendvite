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




    //carico dati in lista , utenti e note in parallelo , mappo id username , salvo nello stato e gestisco loading e errori

    const load = async () => {
        setLoading(true)
        setError('')
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


    //caricamento inizale al montaggio
    useEffect(() => { load() }, [])


    //carica nota
    const onCreate = async (payload) => {
        try {
            await createNote(payload)
            await load()
        } catch {
            alert('Errore creazione')
        }
    }

    const onUpdate = async (id, payload) => {
        try {
            await updateNote(id, payload)
            setEditing(null)
            await load()
        } catch (e) {
            alert(e?.response?.data?.message || 'Errore aggiornamento')
        }
    }

    const onDelete = async (id) => {
        if (!confirm('Eliminare la nota?')) return
        try {
            await deleteNoteById(id)
            await load()
        } catch {
            alert('Errore eliminazione')
        }
    }

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

            {/* ===== ELENCO sotto (senza ricerca/paginazione/filtri) ===== */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800">
                    <h3 className="text-lg font-medium">Elenco note</h3>
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
                                <th className="text-left font-medium">Titolo</th>
                                <th className="text-left font-medium hidden md:table-cell">Assegnata a</th>
                                <th className="text-left font-medium">Stato</th>
                                <th className="text-left font-medium">Azioni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notes.map(n => {
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
                    )}
                </div>
            </div>


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
