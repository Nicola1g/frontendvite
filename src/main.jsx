import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>    {/*Attiva controlli extra*/}
        <BrowserRouter>          {/*Rende disponibili a tutta l’app routing (link, redirect, pagine protette)*/}
            <AuthProvider>       {/*Fornisce stato di login e metodi (login, logout) a qualsiasi componente discendente*/}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
