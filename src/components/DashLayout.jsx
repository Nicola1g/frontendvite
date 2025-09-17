import { Outlet } from 'react-router-dom'

export default function DashLayout() {
    return (
        <div className="card">
            <Outlet />
        </div>
    )
}
