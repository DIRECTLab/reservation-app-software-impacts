import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ChargerData from "../types/ChargerData";


interface ChargerSearch {
  chargerInformation: (ChargerData | undefined)[],
  selectCharger: (charger: ChargerData) => void,
}

const ChargerSearch = ({ chargerInformation, selectCharger }: ChargerSearch) => {
  const [chargerSearch, setChargerSearch] = useState("");
  const [matchingNames, setMatchingNames] = useState<ChargerData[]>([]);

  return (
    <>
      <div className='self-center'>
        <AiOutlineSearch className='absolute mt-6 ml-2 text-gray-500' />
        <input
          type="text"
          placeholder="Charger Name"
          className="input input-bordered w-full max-w-xs mt-2 placeholder: pl-8 placeholder: text-gray-500"
          value={chargerSearch}
          onChange={(event) => {
            let matchingChargerNames = [];

            for (let i of chargerInformation) {
              if (i) {
                if (i.name.toLowerCase().startsWith(event.target.value.toLowerCase()) && event.target.value !== "") {
                  matchingChargerNames.push(i);
                }
              }
            }

            setMatchingNames(matchingChargerNames);
            setChargerSearch(event.target.value)

          }}
        />
      </div>
      {matchingNames.length > 0 ?
        <div className='outline-1	outline-black w-5/6 outline rounded p-1 shadow-lg my-2'>
          <div className="divider my-0" />
          {matchingNames.map((charger, index) => (
            <div key={index}>
              <button className='p-1 py-2' onClick={() => {
                selectCharger(charger);
                const element = document.getElementById('my-modal-6') as HTMLInputElement;
                if (element) {
                  element.checked = true;
                }
                setChargerSearch("");
                setMatchingNames([]);
              }}>
                {charger.name}
              </button>
              <div className="divider my-0" />

            </div>
          ))}
        </div>
        :
        <></>
      }
    </>
  )
}
export default ChargerSearch;