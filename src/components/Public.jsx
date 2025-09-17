export default function Public() {
    const BRAND = 'Sartoria di Famiglia'

    return (
        <div className="grid gap-8">
            {/* HERO */}
            <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 md:p-10 text-center shadow-lg">
                <div className="mx-auto max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/40 bg-amber-900/10 px-3 py-1 text-amber-300 small mb-4">
                        <span>🧵 Su misura</span> <span>·</span> <span>🇮🇹 Made in Italy</span> <span>·</span> <span>🤝 Tradizione di famiglia</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{BRAND}</h1>
                    <p className="mt-4 text-slate-300 leading-relaxed">
                        Realizziamo capi sartoriali con un approccio autenticamente artigianale: ascolto, consulenza sui tessuti,
                        presa misure accurata e prove dedicate. Ogni abito nasce per durare nel tempo, con vestibilità pensata per te
                        e finiture curate a mano. Lavoriamo su appuntamento per garantire attenzione e tranquillità in ogni fase.
                    </p>
                </div>
            </section>

            {/* SERVIZI */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:bg-slate-900/70 transition-colors">
                    <div className="text-xl mb-1">👔 Abiti su misura</div>
                    <p className="text-slate-300">Linee classiche e contemporanee, costruite su di te con prova e controprova.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:bg-slate-900/70 transition-colors">
                    <div className="text-xl mb-1">👗 Cerimonia & occasioni</div>
                    <p className="text-slate-300">Abiti da sposo/sposa, damigella e completi coordinati con accessori.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:bg-slate-900/70 transition-colors">
                    <div className="text-xl mb-1">🪡 Riparazioni sartoriali</div>
                    <p className="text-slate-300">Orli, strette/allarghe, sostituzioni fodere, bottoni/zip e rimessa a modello.</p>
                </div>
            </section>





        </div>
    )
}
