import React, { useEffect, useState } from "react";
import {
  Link
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import api from "../api";
import TokenProps from "../types/TokenProps";


type NavigationBarProps = TokenProps & {
  setMenuOpen: (open: boolean) => void,
  numberOfChargerTokens: number,
}

const NavigationBar = ({ setMenuOpen, token, encodedToken, numberOfChargerTokens }: NavigationBarProps) => {
  // const [numberOfChargerTokens, setNumberOfChargerTokens] = useState<number | string>('...');
  const [loading, setLoading] = useState(false);

  //Comes from this: https://reacthustle.com/blog/how-to-close-daisyui-dropdown-with-one-click
  const handleClick = () => {
    setMenuOpen(false)
    try {
      const elem = (document.activeElement as HTMLElement);
      if (elem) {
        elem.blur();
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
      <div className="navbar bg-base-100 w-full border-primary drop-shadow-md">
        <div className="md:hidden w-full">
          <div className="navbar-start">
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle"
                onClick={() => { setMenuOpen(true) }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </label>
              <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li onClick={handleClick}><Link to="/" className="btn btn-ghost normal-case text-xl w-full my-2">Home</Link></li>
                <li onClick={handleClick}><Link to="/reserve" className="btn btn-ghost normal-case text-xl w-full my-2">Reserve</Link></li>
                <li onClick={handleClick}><Link to="/settings" className="btn btn-ghost normal-case text-xl  w-full my-2">Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="navbar-end justify-end items-end text-end">
            <span className="text-xl px-4">
              <FontAwesomeIcon icon={faCoins} />
              {loading ? <span className="pl-1">...</span> :
                <span className="pl-1">{numberOfChargerTokens < 0 ? '..' : numberOfChargerTokens}</span>
              }
            </span>
          </div>
        </div>

        <nav className="w-full hidden md:flex md:flex-row">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost normal-case text-xl">Home</Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <li><Link to="/reserve">Reserve</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
            <span className="text-xl px-4">
              <FontAwesomeIcon icon={faCoins} />
              {loading ? <span className="pl-1">...</span> :
                <span className="pl-1">{numberOfChargerTokens < 0 ? '..' : numberOfChargerTokens}</span>
              }
              
            </span>
          </div>
        </nav>
      </div>
    </>
  )
}

export default NavigationBar;