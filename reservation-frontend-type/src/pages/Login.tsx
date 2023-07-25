import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import AlertContext, { AlertType } from "../context/AlertContext";

interface LoginProps {
  loginFunc: (userToken: string) => void;
}

const Login = ({ loginFunc }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const alertCtx = useContext(AlertContext);

  const login = async () => {
    if (username === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please enter username", null)
      return;
    }
    if (password === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please enter a password", null)
      return;
    }
    const res = await api('').login({
      'username': username,
      'password': password,
    })

    if (res.error || !res.data) {
      alertCtx.setAlertMessage(AlertType.ERROR, "Invalid Credentials", null)
      return
    }
    else {
      loginFunc(res.data.token)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mt-4 font-bold">Login</h1>
      <div className="form-control w-4/5 max-w-xs mt-16">
        <label className="label">
          <span className="label-text text-xl">Username</span>
        </label>
        <input type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" value={username} onChange={(event) => setUsername(event.target.value)} />
        <label className="label">
          <span className="label-text text-xl">Password</span>
        </label>
        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      <button
        className="btn btn-primary w-4/5 md:w-1/5 mt-8"
        onClick={() => login()}
      >
        Login
      </button>
      <button
        className="w-4/5 md:w-1/5 mt-8 btn btn-accent btn-outline"
        onClick={() => window.location.pathname = "/register"}
      >
        Don't have an account?
      </button>
    </div>
  )
}

export default Login;