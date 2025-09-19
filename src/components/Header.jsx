import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogoutButton from '../features/auth/LogoutButton'

export default function Header() {
    const { user } = useAuth()
    const isAuthed = !!user
    const linkCls = ({ isActive }) => `h-link ${isActive ? 'h-link--active' : ''}`

    return (
        <header className="mb-6">
            <div className="header-surface flex items-center justify-between">

                <div className="h-left">
                    <Link to="/" className="brand-btn">TeamNotes</Link>
                </div>

                {/*a  Destra menu dinamic */}
                <nav className="h-right">
                    {isAuthed ? (
                        <>
                            <NavLink to="/dash" end className={linkCls}>Welcome</NavLink>
                            <NavLink to="/dash/notes" className={linkCls}>Notes</NavLink>
                            <NavLink to="/dash/users" className={linkCls}>Users</NavLink>
                            <span className="h-sep" aria-hidden="true" />
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <NavLink to="/" end className={linkCls}>Home</NavLink>
                            <NavLink to="/login" className={linkCls}>Login</NavLink>
                            <NavLink to="/dash" className={linkCls}>Dashboard</NavLink>    {/*ovviamente requireauth ti riporta a login */}
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
