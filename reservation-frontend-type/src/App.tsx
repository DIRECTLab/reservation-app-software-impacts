import React, { useState, useEffect, useCallback, createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import useToken from './hooks/useToken';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ErrorPage from './pages/ErrorPage';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Reserve from './pages/Reserve';
import api from './api';
import { EncodedTokenContext } from './context/EncodedTokenContext';
import { TokenContext } from './context/TokenContext';
import { AlertProvider } from './context/AlertContext';
import GlobalAlert from './components/GlobalAlert';

function App() {

  const [menuOpen, setMenuOpen] = useState(false);
  const { token, tokenEncoded, login, logout } = useToken();
  const [chargerTokens, setChargerTokens] = useState<number>(-1)



  const loadNumberOfTokens = async () => {
    if (tokenEncoded !== null && token !== null) {
      const res = await api(tokenEncoded).user.getUser(token.id);
      setChargerTokens(res.data.numberOfChargerTokens);
    }
  }

  useEffect(() => {
    loadNumberOfTokens();
  }, [])

  const spendTokens = useCallback((tokenCost: number) => {
    setChargerTokens(prev => prev - tokenCost);
  }, [setChargerTokens]);


  if (!token && window.location.pathname === "/register") {
    return (
      <AlertProvider>
        <Register login={login} />
        <GlobalAlert />
      </AlertProvider>
    )
  }
  if (!token || tokenEncoded === "") {
    if (window.location.pathname !== "/") {
      window.location.pathname = "/"
    }
    return (
      <AlertProvider>
        <Login loginFunc={login} />
        <GlobalAlert />
      </AlertProvider>
    )
  }



  return (
    <BrowserRouter>
      <AlertProvider>
        <TokenContext.Provider value={token}>
          <EncodedTokenContext.Provider value={`${tokenEncoded}`}>
            <NavigationBar setMenuOpen={setMenuOpen} token={token} encodedToken={tokenEncoded} numberOfChargerTokens={chargerTokens} />
            <Routes>
              <Route path="/" element={<Home token={token} menuOpen={menuOpen} setMenuOpen={setMenuOpen} encodedToken={tokenEncoded} />} />
              <Route path='/settings' element={<Settings token={token} logoutFunc={logout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
              <Route path='/reserve' element={<Reserve token={token} encodedToken={tokenEncoded} menuOpen={menuOpen} setMenuOpen={setMenuOpen} spendChargerTokens={spendTokens} numberOfChargerTokens={chargerTokens} />} />
              <Route path='*' element={<ErrorPage />} />
            </Routes>
          </EncodedTokenContext.Provider>
        </TokenContext.Provider>
        <GlobalAlert />
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
