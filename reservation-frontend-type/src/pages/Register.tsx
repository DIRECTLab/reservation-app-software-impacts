import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import { Transition } from "@headlessui/react";
import AlertContext, { AlertType } from "../context/AlertContext";

interface RegisterProps {
  login: (tokenStr: string) => void;
}

const Register = ({ login }: RegisterProps) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState<number>()
  let twoYearsFuture = new Date(); // Getting two years from now to be invalid dates. Can't do one year because of the cars that are 2024 models in 2023
  twoYearsFuture.setFullYear(twoYearsFuture.getFullYear() + 2);
  const alertCtx = useContext(AlertContext);


  const [toggleCarRegistration, setToggleCarRegistration] = useState(false);

  /**
   * Toggles the car registration part of the registration if the data the user inputs is valid
   */
  const validateUserInputPage1 = () => {
    if (username === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please fill out your username", null);
      return
    }
    if (password === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please fill out your password", null);
      return
    }
    if (confirmPassword === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please confirm the password", null);
      return
    }
    if (firstName === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please fill out your first name", null);
      return
    }
    if (lastName === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please fill out your last name", null);
      return
    }
    if (password !== confirmPassword) {
      alertCtx.setAlertMessage(AlertType.ERROR, "Passwords do not match", null);
      return
    }
    setToggleCarRegistration(true);
  }


  const register = async () => {
    if (username === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please fill out your username", null);
      return
    }
    if (password === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please confirm the password", null);
      return
    }
    if (confirmPassword === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please confirm the password", null);
      return
    }
    if (firstName === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please fill out your first name", null);
      return
    }
    if (lastName === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please fill out your last name", null);
      return
    }
    if (password !== confirmPassword) {
      alertCtx.setAlertMessage(AlertType.ERROR, "Passwords do not match", null);
      return
    }
    if (carMake === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please enter your car's make", null);
      return
    }
    if (carModel === "") {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please enter your car's model", null);
      return
    }
    if (!carYear) {
      alertCtx.setAlertMessage(AlertType.ERROR, "Please enter your car's year", null);
      return
    }


    if (carYear.toString().length > 4 || carYear < 1950 || carYear > twoYearsFuture.getFullYear()) {
      alertCtx.setAlertMessage(AlertType.ERROR, "Car's year is invalid", null);
      return
    }


    const res = await api('').createUser({
      'username': username,
      'password': password,
      'firstName': firstName,
      'lastName': lastName
    })
    if (res.error) {
      alertCtx.setAlertMessage(AlertType.ERROR, res.error, null);
      return
    }


    alertCtx.setAlertMessage(AlertType.SUCCESS, "Successfully Created User", null);



    const loginRes = await api('').login({
      'username': username,
      'password': password,
    })
    if (loginRes.error || !loginRes.data) {
      alertCtx.setAlertMessage(AlertType.ERROR, "Something went wrong when logging in", null);
      return
    }

    const addCarRes = await api(loginRes.data.token).vehicle.addCar({
      make: carMake,
      model: carModel,
      year: carYear,
      UserId: res.data.id,
    });
    if (addCarRes.error) {
      alertCtx.setAlertMessage(AlertType.ERROR, addCarRes.error, null);
      return
    }


    window.location.pathname = "/"
    login(loginRes.data.token)

  }

  const checkYearValid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reg = new RegExp(/^\d+$/);
    if (reg.test(e.target.value)) {
      if (e.target.value.length >= 4) {
        if (parseInt(e.target.value) < 1950) {
          setCarYear(1950);
        } else if (parseInt(e.target.value) > twoYearsFuture.getFullYear()) {
          setCarYear(twoYearsFuture.getFullYear());
        } else {
          setCarYear(parseInt(e.target.value));
        }
      } else {
        setCarYear(parseInt(e.target.value));
      }
    } else {
      setCarYear(parseInt(e.target.value))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl my-4 font-bold">Register</h1>
      <div className="form-control w-4/5 max-w-md mt-2 h-full">
        <ul className="steps steps-horizontal mb-4 ">
          <li className="step step-primary">Create Account</li>
          <li className={`step ${toggleCarRegistration ? 'step-primary' : ''}`}>Add Car</li>
        </ul>

        <Transition
          show={!toggleCarRegistration}
          enter="transition-opacity delay-300 duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="card w-full md:w-full bg-base-100 shadow-xl">
            <h1 className="card-title justify-center">Create Account</h1>
            <div className="card-body">
              {/* User Information (Username, Name, Password) */}
              <label className="label">
                <span className="label-text text-xl">Username</span>
              </label>
              <input type="text" placeholder="Username" className="input input-bordered w-full" value={username} onChange={(event) => setUsername(event.target.value)} />
              <label className="label">
                <span className="label-text text-xl">First Name</span>
              </label>
              <input type="text" placeholder="First Name" className="input input-bordered w-full" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              <label className="label">
                <span className="label-text text-xl">Last Name</span>
              </label>
              <input type="text" placeholder="Last Name" className="input input-bordered w-full" value={lastName} onChange={(event) => setLastName(event.target.value)} />

              {/* Password Input */}
              <label className="label">
                <span className="label-text text-xl">Password</span>
              </label>
              <input type="password" placeholder="Password" className="input input-bordered w-full" value={password} onChange={(event) => setPassword(event.target.value)} />
              <label className="label">
                <span className="label-text text-xl">Confirm Password</span>
              </label>
              <input type="password" placeholder="Confirm Password" className="input input-bordered w-full" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </div>
            <div className="card-actions justify-end mx-8 mb-8">
              <button className="btn btn-primary px-8" onClick={validateUserInputPage1}>Next</button>
            </div>
          </div>
          <div className="my-8 flex justify-center">
          <button
            className="btn btn-accent btn-outline"
            onClick={() => window.location.pathname = "/"}
          >
            Already have an account?
          </button>
          </div>
        </Transition>
        <Transition
          show={toggleCarRegistration}
          enter="transition-opacity duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-0"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="card w-full md:w-full bg-base-100 shadow-xl">
            <h1 className="card-title justify-center">Add Vehicle</h1>
            <div className="card-body">
              {/* Car Input */}
              <label className="label">
                <span className="label-text text-xl">Car Make</span>
              </label>
              <input type="text" placeholder="Car Make" className="input input-bordered w-full" value={carMake} onChange={(event) => setCarMake(event.target.value)} />
              <label className="label">
                <span className="label-text text-xl">Car Model</span>
              </label>
              <input type="text" placeholder="Car Model" className="input input-bordered w-full" value={carModel} onChange={(event) => setCarModel(event.target.value)} />
              <label className="label">
                <span className="label-text text-xl">Year</span>
              </label>
              <input type="number" placeholder="Car Year" className="input input-bordered w-full" min={1950} max={twoYearsFuture.getFullYear()} value={carYear} onChange={checkYearValid} />
            </div>

            <div className="card-actions flex flex-row mx-8 mb-8">
              <div className="flex-1">
                <button className="btn btn-primary btn-ghost md:px-8 justify-start" onClick={() => setToggleCarRegistration(false)}>Back</button>
              </div>
              <button className="btn btn-primary md:px-8 float-right" onClick={register}>Create Account</button>
            </div>
          </div>

        </Transition>
      </div>
    </div>
  )
}
export default Register;