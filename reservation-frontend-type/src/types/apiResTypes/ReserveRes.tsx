import ResponseBase from "./ResponseBase";

interface ReserveRes extends ResponseBase {
  id: number,
  datetime: string,
  UserId: number,
  ChargerId: number,
  updatedAt: string,
  createdAt: string,  
}

export default ReserveRes;