export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="mt-8">
            <div className="app-shell">
                <div className="footer-surface">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <div className="footer-brand">TeamNotes</div>
                            <div className="footer-meta">© {year} · React + Vite · </div>
                        </div>


                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <a href="mailto:support@teamnotes.app" className="chip" aria-label="Email">
                                📧 <span className="chip-muted">support@studenti.poliba.app</span>
                            </a>
                            <a href="tel:+390000000000" className="chip" aria-label="Telefono">
                                📞 <span className="chip-muted">+39 000 000 000</span>
                            </a>
                            <span className="chip" aria-label="Indirizzo">
                📍 <span className="chip-muted">Via Orabona 123, Bari</span>
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
