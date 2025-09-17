import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { listNotes } from '../notes/notesApi'
import { listUsers } from '../users/usersApi'

export default function Welcome() {
    const { user } = useAuth()
    const username = user?.username || 'Utente'
    const myId = user?._id || user?.id

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [notes, setNotes] = useState([])
    const [userMap, setUserMap] = useState({})

    useEffect(() => {
        let mounted = true
        ;(async () => {
            setLoading(true); setError('')
            try {
                const [ns, us] = await Promise.all([
                    listNotes(),
                    listUsers().catch(() => []),
                ])
                if (!mounted) return
                const map = Object.fromEntries(
                    us.map(u => [u._id || u.id, u.username || String(u._id || u.id)])
                )
                setUserMap(map)
                setNotes(ns)
            } catch {
                setError('Errore nel caricamento dei dati')
            } finally {
                mounted && setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [])

    // ---- Quick stats
    const { total, open, mineOpen } = useMemo(() => {
        const t = notes.length
        const o = notes.filter(n => !n.completed).length
        const m = notes.filter(n => !n.completed && (n.user?._id === myId || n.user === myId)).length
        return { total: t, open: o, mineOpen: m }
    }, [notes, myId])

    // ---- Recenti (ordina per updatedAt/createdAt se presenti)
    const recent = useMemo(() => {
        const pickDate = n => new Date(n.updatedAt || n.createdAt || 0).getTime()
        return [...notes].sort((a,b) => pickDate(b) - pickDate(a)).slice(0, 5)
    }, [notes])

    return (
        <div className="grid gap-6">
            {/* Hero (NESSUN BOTTONE, dimensioni invariate) */}
            <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold">Benvenuto, {username}</h1>
                        <p className="text-slate-300 small">
                            Questa è la tua pagina iniziale. Vai su <span className="text-slate-200">Notes</span> dal menu in alto per iniziare.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick stats (invariate) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="text-slate-400 small">Note aperte</div>
                    <div className="text-3xl font-semibold">{loading ? '—' : open}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="text-slate-400 small">Le mie note aperte</div>
                    <div className="text-3xl font-semibold">{loading ? '—' : mineOpen}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="text-slate-400 small">Totale note</div>
                    <div className="text-3xl font-semibold">{loading ? '—' : total}</div>
                </div>
            </section>

            {/* Ultime note — SOLO FRECCIA a destra, nessun testo */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Ultime note</h3>
                    <Link
                        to="/dash/notes"
                        aria-label="Apri elenco completo"
                        title="Apri elenco completo"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800/60 text-slate-200"
                    >
                        <span aria-hidden>→</span>
                    </Link>
                </div>

                <div className="p-5">
                    {loading ? (
                        <div>Caricamento…</div>
                    ) : error ? (
                        <div className="rounded-lg border border-red-300/40 bg-red-900/40 px-3 py-2 text-sm">{error}</div>
                    ) : recent.length === 0 ? (
                        <div className="text-slate-400 small">Nessuna nota presente.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="text-slate-400">
                            <tr>
                                <th className="text-left font-medium">Titolo</th>
                                <th className="text-left font-medium hidden md:table-cell">Assegnata a</th>
                                <th className="text-left font-medium">Stato</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recent.map(n => {
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
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    )
}
