import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css'
import MainPage from './pages/MainPage';

function Main() {
  return(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>} />
        </Routes>
      </BrowserRouter>    
    </StrictMode>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
