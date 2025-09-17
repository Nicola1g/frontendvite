import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
    return (
        <div className="min-h-[calc(100svh+var(--page-extra))] grid grid-rows-[auto_1fr_auto] bg-slate-950">
            {/* Header */}
            <div className="app-shell">
                <Header />
            </div>

            {/* Contenuto (riempie lo spazio centrale) */}
            <main className="app-shell">
                <Outlet />
            </main>

            {/* Footer non fisso, ma sempre al fondo della pagina */}
            <Footer />
        </div>
    )
}
