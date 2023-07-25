import ResponseBase from "./ResponseBase";

interface LoginRes extends ResponseBase {
  data: {
    token: string
  }
}

export default LoginRes;