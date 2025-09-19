import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
    return (
        <div className="min-h-[calc(100svh+var(--page-extra))] grid grid-rows-[auto_1fr_auto] bg-slate-950">

            <div className="app-shell">
                <Header />
            </div>


            <main className="app-shell">
                <Outlet />
            </main>


            <Footer />
        </div>
    )
}
{/*app-shell occupa larghezza massima */}