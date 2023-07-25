import Charger from "../Charger";
import ResponseBase from "./ResponseBase";

interface ChargerRes extends ResponseBase {
  data: Charger[],
}

export default ChargerRes;