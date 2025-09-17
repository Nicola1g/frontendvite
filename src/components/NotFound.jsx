import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-[60vh] grid place-items-center">
            <div className="card text-center">
                <h1 className="text-3xl font-semibold mb-2">Pagina non trovata</h1>
                <p className="text-slate-300 mb-4">La risorsa richiesta non esiste o è stata spostata.</p>
                <Link to="/" className="btn btn-primary">Torna alla Home</Link>
            </div>
        </div>
    )
}