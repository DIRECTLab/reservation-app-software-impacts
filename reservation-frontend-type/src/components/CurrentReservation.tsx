import { useContext, useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import api from "../api";
import Reservation from "../types/Reservation";
import AlertContext, { AlertType } from "../context/AlertContext";

interface CurrentReservationProps {
  userId: number,
  encodedToken: string | null,
  menuOpen: boolean,
}

const CurrentReservation = ({userId, encodedToken, menuOpen}: CurrentReservationProps) => {
  const alertCtx = useContext(AlertContext);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  const getCurrent = async () => {
    if (encodedToken !== null) {
      const res =  await api(encodedToken).reservation.getCurrent(userId);
      console.log(res)
      if (res.error) {
        alertCtx.setAlertMessage(AlertType.ERROR, res.error, null);
        return
      }
      setLoading(false)
      setCurrentReservation(res.data[0]);
    }
  }

  const getOneHourAhead = (date: string) => {
    let tempDateInMilli = new Date(date).getTime();
    let tempDate = new Date(tempDateInMilli + 1 * 60 * 60 * 1000);
    return tempDate.toLocaleTimeString();
  }

  useEffect(() => {
    setLoading(true)
    getCurrent()
    
  }, [])

  const formatTime = (date: string) => {
    let tempDate = new Date(date);

    return tempDate.toLocaleTimeString();
  }

  const formatDate = ((date: string) => {
    return `${new Date(date).toLocaleDateString('en-us')}`
  })


  let navigate = useNavigate()
  const routeChange = (path: string) => {
    navigate(path)
  }


  if (!currentReservation) {
    return (
      <div className={`card w-4/5 md:w-2/5 bg-base-100 shadow-xl flex justify-center items-center ${menuOpen ? '-z-10' : ''}`}>
        <div className="card-body">
          <h2 className="card-title justify-center text-center">No Current Reservation</h2>
          <div className="card-actions justify-center mt-8">
            <button 
              className="btn btn-primary"
              onClick={() => {routeChange("/reserve"); }}
            >
              Make a Reservation
            </button>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="card w-4/5 md:w-2/5 bg-base-100 shadow-xl flex justify-center items-center -z-10">
        <div className="card-body">
          <h2 className="card-title justify-center">{currentReservation.Charger.name}</h2>
          <h2 className="text-lg self-center">{formatDate(currentReservation.datetime)}</h2>
          <h2 className="text-lg self-center">Starts at: {formatTime(currentReservation.datetime)}</h2>
          <h2 className="text-lg self-center">Ends at: {getOneHourAhead(currentReservation.datetime)}</h2>
        </div>
      </div>
    )
  }
}

export default CurrentReservation;