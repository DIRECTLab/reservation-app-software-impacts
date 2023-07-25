import ResponseBase from "./ResponseBase";

interface Car {
  id: number,
  make: string,
  model: string,
  year: number,
  createdAt: string,
  updatedAt: string,
  UserId: number,
}

interface CarRes extends ResponseBase {
  data: Car[]
}

export default CarRes;