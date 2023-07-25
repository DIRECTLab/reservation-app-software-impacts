import Charger from "./Charger";

interface Reservation {
  id: number,
  datetime: string,
  createdAt: string,
  updatedAt: string,
  ChargerId: number,
  UserId: number,
  Charger: Charger,
};

export default Reservation;