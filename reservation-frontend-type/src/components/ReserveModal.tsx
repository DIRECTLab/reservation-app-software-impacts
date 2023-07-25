import React, { ChangeEvent, useContext, useEffect, useState, useRef } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import TokenProps from "../types/TokenProps";
import ChargerData from "../types/ChargerData";
import { DateType, DateValueType } from "react-tailwindcss-datepicker/dist/types";
import AlertContext, { AlertType } from "../context/AlertContext";

type ReserveModalProps = TokenProps & {
  charger: ChargerData | undefined,
  spendChargerTokens: (cost: number) => void,
  numberOfChargerTokens: number,
}

interface OptimalChargeRange {
  low: number,
  high: number
}


const ReserveModal = ({ token, encodedToken, charger, spendChargerTokens, numberOfChargerTokens }: ReserveModalProps) => {



  const lowChargeValue = 30;
  const highChargeValue = 150;
  const [currentKWReserve, setCurrentKWReserve] = useState(((highChargeValue - lowChargeValue) * 0.5) + lowChargeValue);
  const [dateSet, setDateSet] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateValueType>({ startDate: new Date(), endDate: null });
  const [selectedHour, setSelectedHour] = useState(new Date().getHours() + 1);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectableHours, setSelectableHours] = useState<number[]>([]);
  const [optimalChargeRange, setOptimalChargeRange] = useState<OptimalChargeRange>();
  // const [numberOfChargerTokens, setNumberOfChargerTokens] = useState(0);
  const [costOfReservation, setCostOfReservation] = useState(1);
  const sliderRef = useRef(null);
  const alertCtx = useContext(AlertContext);

  const [disableReserveButton, setDisableReserveButton] = useState(numberOfChargerTokens < costOfReservation);


  useEffect(() => {
    setDateSet(false);
  }, []);

  function componentToHex(c: number) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
  }

  class Color {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
      this.r = r;
      this.g = g;
      this.b = b;
    }

    toString() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, 1)`
    }

    toHex() {
      return rgbToHex(this.r * 255.999, this.g * 255.999, this.b * 255.999);
    }
  }

  function blendColors(color1: Color, color2: Color, step: number) {
    // blends colors with linear interpolation, step should be 0-1
    return new Color(color1.r * (1 - step) + color2.r * step, color1.g * (1 - step) + color2.g * step, color1.b * (1 - step) + color2.b * step);
  }

  class Gradient {
    colors: Color[];
    steps: number[];

    constructor(colors: Color[], steps: number[]) {
      // takes in an array of colors and steps where it should be applied
      // where step is the point you want it to 'become' that color. There should always be at least 2 colors, one at the minimum value, one at the max
      this.colors = colors;
      this.steps = steps;
    }

    evaluate(value: number) {
      let color1, step1;
      let color2, step2;
      for (let i = 0; i < this.colors.length - 1; i++) {
        if (value >= this.steps[i] && value <= this.steps[i + 1]) {
          color1 = this.colors[i];
          step1 = this.steps[i];
          color2 = this.colors[i + 1];
          step2 = this.steps[i + 1];
          break;
        }
      }
      if (!color1) {
        throw new Error("Invalid colors, steps, or value.");
      }

      if (step1 !== undefined && step2 !== undefined && color1 !== undefined && color2 !== undefined) {
        const step = (value - step1) / (step2 - step1);
        const blendedColor = blendColors(color1, color2, step);
        return blendedColor.toHex();
      }
    }
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1)

  const formatHour = (time: number) => {
    if (time > 12) {
      return `${time - 12} PM`
    } else if (time === 12) {
      return `${time} PM`
    } else if (time === 0) {
      return `${time + 12} AM`
    } else {
      return `${time} AM`
    }
  }

  /**
   * Checks if the user has enough tokens then trys to make the reservation on the charger
   * 
   */
  const reserveTime = async () => {
    let date = selectedDate?.startDate?.toString();
    if (!date) return;
    let day = new Date(date)
    day.setDate(day.getDate() + 1)
    day.setHours(selectedHour, 0, 0, 0);

    if (!encodedToken) return;
    if (!charger) return;


    const res = await api(encodedToken).reservation.reserve({
      'datetime': day,
      'ChargerId': charger.id,
      'UserId': token.id,
      'chargeAmount': currentKWReserve,
      'cost': costOfReservation
    });
    console.log(res)
    if (res.error) {
      alertCtx.setAlertMessage(AlertType.ERROR, res.error, null);
      return
    } else { // Successfully made reservation
      alertCtx.setAlertMessage(AlertType.SUCCESS, "Reservation Made", null);
      spendChargerTokens(costOfReservation); // Update state value that is storing the token amount
      let date = selectedDate?.startDate?.toString();
      if (date)
        getReservationsOnCharger(charger.id, new Date(date));
    }
  }

  const getReservationsOnCharger = async (chargerId: number, date: Date) => {
    let todayDate = `${new Date().toISOString().split('T')[0]}`
    let availableHours = [];

    let selDate = date.toISOString().split('T')[0];
    if (chargerId && date != null && date !== undefined) {
      if (!encodedToken) return;
      let reservations = await api(encodedToken).getAllChargerReservations(chargerId, date);
      if (!reservations.error) {
        let takenReservations = [];

        for (let i = 0; i < reservations.data?.length ?? 0; i++) {

          let tempDate = new Date(reservations.data[i].datetime);
          takenReservations.push(tempDate.getHours())
        }

        if (selDate === todayDate) {
          for (let i = currentHour + 1; i < 24; i++) {
            if (!takenReservations.includes(i)) {
              availableHours.push(i);
            }
          }
        } else {
          for (let i = 0; i < 24; i++) {
            if (!takenReservations.includes(i)) {
              availableHours.push(i);
            }
          }
        }
        setSelectableHours(availableHours);
        setSelectedHour(availableHours[0]);

      }



    } else {
      if (selDate === todayDate) {
        for (let i = currentHour + 1; i < 24; i++) {
          availableHours.push(i);
        }
      } else {
        for (let i = 0; i < 24; i++) {
          availableHours.push(i);
        }
      }

      setSelectableHours(availableHours);
      setSelectedHour(availableHours[0]);
    }
  }

  useEffect(() => {
    let strSelDate = selectedDate?.startDate?.toString();
    if (!strSelDate) return;
    if (!charger) return;
    const date = new Date(strSelDate);

    getReservationsOnCharger(charger.id, date);

  }, [selectedDate, charger])



  const loadNewRange = async () => {
    if (!encodedToken) return;
    const res = await api(encodedToken).charger.getOptimalChargeRange(1, `${selectedDate}T${selectedHour ?? '00'}:00:00Z`); // This is probably not correct, Check this once backend is implemented fully
    setOptimalChargeRange(res.data.chargeRange);
  }

  const root = document.querySelector(":root") as HTMLElement;
  const red = new Color(224 / 255, 60 / 255, 50 / 255);
  const blue = new Color(19 / 255, 232 / 255, 161 / 255);
  const green = new Color(123 / 255, 182 / 255, 98 / 255);


  const setSliderColor = (chargeAmount: number) => {
    const gradient = new Gradient([blue, green, red], [0, (((optimalChargeRange?.low ?? 50 - lowChargeValue) / (highChargeValue - lowChargeValue)) + ((optimalChargeRange?.high ?? 100 - lowChargeValue) / (highChargeValue - lowChargeValue))) * 50, 100]);
    let color = `${gradient.evaluate(chargeAmount)}`;
    root.style.setProperty('--sliderColor', color);

    setCurrentKWReserve(Number.parseFloat(((chargeAmount / 100) * (highChargeValue - lowChargeValue) + lowChargeValue).toFixed(1)));
  }

  useEffect(() => {
    loadNewRange();
    setSliderColor(50);
    let slider = document.getElementById('chargeSlider') as HTMLInputElement;
    if (!slider) return;
    let startingChargeKw = (((highChargeValue - lowChargeValue) * 0.5) + lowChargeValue);
    let startingChargeToPercentage = (startingChargeKw - lowChargeValue) / (highChargeValue - lowChargeValue) * 100
    slider.value = '' + startingChargeToPercentage;
  }, [selectedDate, selectedHour]);


  const handleSliderInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderColor(parseFloat(event.target.value));
  }


  const getTokenCost = async (event: any) => {
    if (encodedToken) {
      const res = await api(encodedToken).charger.getCost(1, `${selectedDate}T${selectedHour ?? '00'}:00:00Z`, parseFloat(event.target.value));
      setCostOfReservation(res.data.cost);

      if (res.data.cost > numberOfChargerTokens) {
        setDisableReserveButton(true);
      } else {
        if (disableReserveButton)
          setDisableReserveButton(false)
      }
    }

  }

  useEffect(() => {
    if (!selectedDate?.startDate) {
      setDateSet(false);
    }
  }, [selectedDate])

  const setOptimalCharge = () => {
    if (optimalChargeRange) {
      let optimalValue = (optimalChargeRange?.low + optimalChargeRange?.high) / 2;
      let optimalToPercentage = (optimalValue - lowChargeValue) / (highChargeValue - lowChargeValue) * 100;
      setSliderColor(optimalToPercentage);
      setCurrentKWReserve(optimalValue);
      let slider = document.getElementById('chargeSlider') as HTMLInputElement;
      slider.value = '' + optimalToPercentage

    }
  }

  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom md:modal-middle ">
        <div className="modal-box w-full h-4/5">
          <label htmlFor="my-modal-6" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

          <h3 className="font-bold text-lg">Reservation</h3>
          <p className="py-4">You selected: <strong>{charger?.name}</strong></p>
          <h4>Choose a date for your reservation:</h4>
          <div className='mt-4'>
            <Datepicker
              primaryColor='green'
              minDate={new Date()}
              useRange={false}
              asSingle={true}
              value={selectedDate}
              readOnly
              onChange={(newDate) => { setSelectedDate(newDate); setDateSet(true) }}
              inputClassName="w-full rounded-md focus:ring-0 font-normal !text-gray-500 dark:bg-white !dark:text-gray-500"
            />
          </div>



          {dateSet ?
            <div>
              <div className={`overflow-x-auto w-full flex flex-col items-center h-1/2 mt-4 ${!isVisible ? "visible" : "hidden"}`}>
                <button className="btn btn-primary w-full" onClick={() => { setIsVisible(true) }}>
                  Reservation Time: {formatHour(selectedHour)}
                </button>

                <div>
                  <h2 className="text-center mt-4 font-semibold">{currentKWReserve}kW</h2>
                </div>
                <div className="range">
                  <input
                    type="range"
                    id="chargeSlider"
                    min={0}
                    max={100}
                    onChange={handleSliderInput}
                    onClick={getTokenCost}
                    ref={sliderRef}
                  />
                </div>

                <div className="w-full flex flex-row">
                  <span className="text-xs flex-auto">Slowest Rate</span>
                  <span className="text-xs flex-auto text-right">Fastest Rate</span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={setOptimalCharge}>Optimal Charge</button>

                <div className="w-full mt-4 text-center">

                  <h1 className="text-lg font-bold">Costs: <span className="text-error pl-1"><FontAwesomeIcon icon={faCoins} /><span className="pl-1">{costOfReservation}</span></span></h1>
                  <h1 className="text-lg font-bold">Available: <span className="text-primary pl-1"><FontAwesomeIcon icon={faCoins} /><span className="pl-1">{numberOfChargerTokens}</span></span></h1>
                </div>

                <div className={`modal-action w-full ${(selectableHours !== null && selectedDate !== null) ? '' : 'invisible'}`}>
                  <label htmlFor="my-modal-6" className={`btn btn-primary w-full ${disableReserveButton ? 'btn-disabled' : ''}`} onClick={() => { reserveTime() }}>Reserve</label>
                </div>
              </div>


              <div className={`overflow-x-auto w-full flex flex-col items-center md:h-96 ${isVisible ? "visible" : "hidden"}`}>
                {selectableHours.map(time => (
                  <button className="btn btn-primary w-full mt-4" key={time} onClick={() => { setSelectedHour(time); setIsVisible(false) }}>{formatHour(time)}</button>
                ))}
              </div>
            </div>
            :
            <></>
          }


        </div>

      </div>
    </>
  )
}


export default ReserveModal