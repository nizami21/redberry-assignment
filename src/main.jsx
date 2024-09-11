import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css'
import MainPage from './pages/MainPage';
import NewListingPage from './pages/NewListingPage';

function Main() {
  return(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>} />
          <Route path='/newListing' element={<NewListingPage/>} />
        </Routes>
      </BrowserRouter>    
    </StrictMode>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
