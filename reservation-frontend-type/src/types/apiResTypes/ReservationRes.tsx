import Reservation from "../Reservation";
import ResponseBase from "./ResponseBase";

interface ReservationRes extends ResponseBase {
    data: Reservation[],
}

export default ReservationRes;