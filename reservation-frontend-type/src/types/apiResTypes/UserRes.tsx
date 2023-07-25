import User from "../user/User";
import ResponseBase from "./ResponseBase";

interface UserRes extends ResponseBase {
  data: User,
}
export default UserRes;