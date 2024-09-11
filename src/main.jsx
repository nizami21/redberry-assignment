import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='h-screen w-screen flex justify-center align-center text-3xl'>Hello World</div>
  </StrictMode>,
)
