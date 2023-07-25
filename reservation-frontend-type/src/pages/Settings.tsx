import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuOpenProps from "../types/MenuOpenProps";
import Token from "../types/Token";
import CarDisplay from "../components/CarDisplay";
import { EncodedTokenContext } from "../context/EncodedTokenContext";

type SettingsProps = MenuOpenProps & {
  token: Token,
  logoutFunc: () => void,
}

const Settings = ({token, logoutFunc, menuOpen, setMenuOpen}: SettingsProps) => {
  const tokenEncoded = useContext(EncodedTokenContext)


  let navigate = useNavigate()
  const routeChange = (path: string) => {
    navigate(path)
  }
  const logout = () => {
    logoutFunc();
    return routeChange("/")
  }

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
      <h2 className="text-2xl font-bold mt-4">Settings</h2>
      <h2 className="text-xl font-semibold mt-8">Your Vehicles</h2>
      <CarDisplay menuOpen={menuOpen}/>
      <div className="fixed bottom-8 w-3/4 md:w-2/5 lg:w-1/5">
        <button 
          className="btn btn-error w-full"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
export default Settings;