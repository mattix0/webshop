import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Card from './pages/Card.jsx'
import Products from './pages/Products.jsx'
import Dashboard from './pages/protected/Dashboard.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/card" element={<Card />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
 </StrictMode>
)
