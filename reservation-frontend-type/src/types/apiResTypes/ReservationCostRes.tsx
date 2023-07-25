import ResponseBase from "./ResponseBase";

interface ReservationCostRes extends ResponseBase {
  data: {
    cost: number
  }
}
export default ReservationCostRes;