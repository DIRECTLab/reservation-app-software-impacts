import ResponseBase from "./ResponseBase";

interface OptimalChargeRangeRes extends ResponseBase{
  data: {
    chargeRange: {
      low: number
      high: number
    }
  }
}

export default OptimalChargeRangeRes;