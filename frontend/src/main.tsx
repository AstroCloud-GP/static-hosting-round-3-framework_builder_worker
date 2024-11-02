import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import StaticHosting from './pages/StaticHosting.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path="hosting" element={<StaticHosting/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
