import { useContext, useEffect, useState } from "react";
import api from '../api';
import TokenProps from "../types/TokenProps";
import MenuOpenProps from "../types/MenuOpenProps";
import ReserveMap from "../components/ReserveMap";
import ChargerData from "../types/ChargerData";
import ChargerSearch from "../components/ChargerSearch";
import ReserveModal from "../components/ReserveModal";
import AlertContext, { AlertType } from "../context/AlertContext";

type ReserveProps = TokenProps & MenuOpenProps & {
  spendChargerTokens: (cost: number) => void,
  numberOfChargerTokens: number
}



const Reserve = ({ token, menuOpen, setMenuOpen, encodedToken, spendChargerTokens, numberOfChargerTokens } : ReserveProps) => {
  const [loading, setLoading] = useState(true)
  const [charger, setCharger] = useState<ChargerData>()
  const [chargerInformation, setChargerInformation] = useState<(ChargerData | undefined)[]>([])

  const alertCtx = useContext(AlertContext);

  const getChargers = async () => {
    if (encodedToken !== null) {
      const chargersRes = await api(encodedToken).getChargers();
      if (chargersRes.error) {
        alertCtx.setAlertMessage(AlertType.ERROR, chargersRes.error, null);
        return
      }
      let chargerInformation = chargersRes.data.map(data => {
        if (data.name !== null && data.latitude !== null && data.longitude !== null) {
          let dataObject = {
            "id": data.id,
            "name": data.name,
            "latitude": data.latitude,
            "longitude": data.longitude
          }
          return dataObject
        }
      })
      chargerInformation = chargerInformation.filter((element) => {
        return element !== undefined;
      });
      if (chargerInformation) {
        setChargerInformation(chargerInformation)
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    getChargers()
  }, [])

  const selectCharger = (charger: ChargerData) => {
    setCharger(charger)
  }

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }


  return (
    <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
      <h1 className="text-2xl font-bold mt-4">Reserve</h1>
      <h2 className='text-md mt-4'>Select the charger you want to reserve</h2>
      <ReserveMap menuOpen={menuOpen} chargerInformation={chargerInformation} selectCharger={selectCharger}/>

      <h2 className='text-md mt-4'>Search for it manually</h2>
      <div className='relative w-4/5 flex justify-center flex-col'>
        <ChargerSearch chargerInformation={chargerInformation} selectCharger={selectCharger}/>
      </div>
      <ReserveModal token={token} encodedToken={encodedToken} charger={charger} spendChargerTokens={spendChargerTokens} numberOfChargerTokens={numberOfChargerTokens}/>
    </div>
  )
}
export default Reserve;