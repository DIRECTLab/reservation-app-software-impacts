import { useContext, useEffect, useState } from "react";
import api from "../api";
import Reservation from "../types/Reservation";
import AlertContext, { AlertType } from "../context/AlertContext";

interface UpcomingReservationProps {
  userId: number,
  encodedToken: string | null,
}


const UpcomingReservations = ({ userId, encodedToken }: UpcomingReservationProps) => {
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const alertCtx = useContext(AlertContext);
  
  const getUpcomingReservations = async () => {
    if (encodedToken !== null) {
      const res = await api(encodedToken).reservation.getUpcoming(userId);
  
      if (res.error) {
        alertCtx.setAlertMessage(AlertType.ERROR, res.error, null);
        return;
      }
  
      setUpcomingReservations(res.data);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    getUpcomingReservations()
  }, [])


  const deleteReservation = async (id: number) => {
    if (encodedToken !== null) {
      const res = await api(encodedToken).reservation.delete(id);
  
      if (res.error) {
        alertCtx.setAlertMessage(AlertType.ERROR, res.error, null);
        return;
      }
  
      setLoading(true);
      getUpcomingReservations();
    }
  }


  const formatTime = (date: string) => {
    let tempDate = new Date(date);

    return tempDate.toLocaleTimeString();
  }

  const getOneHourAhead = (date: string) => {
    let tempDateInMilli = new Date(date).getTime();
    let tempDate = new Date(tempDateInMilli + 1 * 60 * 60 * 1000);
    return tempDate.toLocaleTimeString();
  }

  const formatDate = ((date: string) => {
    return `${new Date(date).toLocaleDateString('en-us')}`
  })

  // const upcomingReservations = [1,2] // Replace with actual data

  return (
    <div className="w-full md:w-full bg-base-100 flex flex-col justify-center items-center">
      {loading && <div> </div>}
      {!loading && upcomingReservations.length !== 0 && 
        <>
          {upcomingReservations.map(reservation => (
            <div className="card w-4/5 md:w-2/5 bg-base-100 shadow-xl flex justify-center items-center mb-8" key={reservation.id}>
              <div className="card-body">
                <h2 className="card-title justify-center">{reservation.Charger.name}</h2>
                <h2 className="text-lg self-center">{formatDate(reservation.datetime)}</h2>
                <h2 className="text-lg self-center">{formatTime(reservation.datetime)} - {getOneHourAhead(reservation.datetime)}</h2>
                <div className="card-actions justify-center mt-8">
                  <button className="btn btn-error" onClick={() => deleteReservation(reservation.id)}>Cancel Reservation</button>
                </div>
              </div>
            </div>
          ))}
        </>
      }
      {!loading && upcomingReservations.length === 0 &&
        <div className="card w-4/5 md:w-2/5 bg-base-100 shadow-xl flex justify-center items-center mb-8">
          <div className="card-body">
            <h2 className="card-title justify-center text-center">No Scheduled Reservations</h2>     
          </div>
        </div>
      }
    </div>
  )
}

export default UpcomingReservations;