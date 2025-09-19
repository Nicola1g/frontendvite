
import { useAuth } from '../../context/AuthContext'


export default function Welcome() {
    const { user } = useAuth()
    const username = user?.username || 'Utente'


    return (
        <div className="grid gap-6">

            <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold">Benvenuto, {username}</h1>
                        <p className="text-slate-300 small">
                            Questa è la tua pagina iniziale. Vai su Notes dal menu in alto per iniziare.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
