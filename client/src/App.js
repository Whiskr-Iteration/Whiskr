import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './stylesheet.css';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import CreateAccountAdopter from './pages/CreateAccountAdopter';
import CreateAccountCat from './pages/CreateAccountCat';
import About from './pages/About';
import AdopterCardsPage from './pages/AdopterCardsPage';
import CatCardsPage from './pages/CatsCardsPage';

function App() {
  const [emailPrefill, setEmailPrefill] = useState(null);
  return (
    <div className='app'>
      <BrowserRouter>
        <Navbar />
        <div className='container'>
          <Routes>
            <Route className='signup-link' path='/' element={<Home emailPrefill={emailPrefill} setEmailPrefill={setEmailPrefill}/>} />
            <Route path='/login' element={<Login emailPrefill={emailPrefill} setEmailPrefill={setEmailPrefill} />} />
            <Route path='/about' element={<About />} />
            <Route path='/signup' element={<Signup emailPrefill={emailPrefill} setEmailPrefill={setEmailPrefill} />} />
            <Route path='/createAccountAdopter' element={<CreateAccountAdopter emailPrefill={emailPrefill} setEmailPrefill={setEmailPrefill} />}
            />
            <Route path='/create-account-cat' element={<CreateAccountCat emailPrefill={emailPrefill} setEmailPrefill={setEmailPrefill} />} />
            <Route path='/AdopterCardsPage' element={<AdopterCardsPage />} />
            <Route path='/CatsCardsPage' element={<CatCardsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
