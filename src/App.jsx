import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import NotFound from './components/NotFound'
import RequireAuth from './components/RequireAuth'

import DashLayout from './components/DashLayout'
import Login from './features/auth/Login'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList.jsx'
import UsersList from "./features/users/UsersList.jsx";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />

                <Route element={<RequireAuth />}>
                    <Route path="dash" element={<DashLayout />}>
                        <Route index element={<Welcome />} />
                        <Route path="notes" element={<NotesList />}/>
                        <Route path="users" element={<UsersList />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}
