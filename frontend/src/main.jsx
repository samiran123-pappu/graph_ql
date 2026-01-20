import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { BackgroundRippleEffect } from './components/ui/background-ripple-effect.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="relative min-h-screen w-full bg-neutral-950">
        <BackgroundRippleEffect />
        <div className="relative z-10">
          <App />
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>,
)


