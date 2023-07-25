import jwt_decode from "jwt-decode";
import Token from "../types/Token";
import { useState } from "react";


function decodeJwt(token: string) : Token {
  const decoded = jwt_decode<Token>(token);
  return decoded;
}

const useToken = () => {
  const getEncodedToken = () => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) return null;
    return tokenString;
  }

  const decodeToken = (tokenStr : string | null) => {
    if (!tokenStr) return null;
    const decodedToken = decodeJwt(tokenStr);
    return decodedToken;
  }

  const getTokenFromLocal = () => {
    const decodedToken = decodeToken(getEncodedToken());
    if (decodedToken === null) return null;
    let currentTime = Number.parseInt((new Date().getTime() / 1000).toFixed(0));
    if (currentTime > decodedToken.exp) return null;
    return decodedToken;
  }

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  const [token, setToken] = useState(getTokenFromLocal());
  const [tokenEncoded, setTokenEncoded] = useState(getEncodedToken());

  const saveToken = (tokenStr : string) => {
    localStorage.setItem('token', tokenStr);
  }

  const login = (tokenStr : string) => {
    saveToken(tokenStr);
    setTokenEncoded(tokenStr);
    setToken(decodeToken(tokenStr));
  }

  return {
    login,
    logout,
    token,
    tokenEncoded,
  }
}

export default useToken;