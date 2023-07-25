import ResponseBase from "./ResponseBase";

interface CreateUserRes extends ResponseBase {
  data: {
    id: number,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    numberOfChargeTokens: number,
    updatedAt: string,
    createdAt: string,
  }
}
export default CreateUserRes;