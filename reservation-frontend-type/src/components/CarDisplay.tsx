import React, {useContext, useEffect, useState} from 'react';
import api from '../api';
import { EncodedTokenContext } from '../context/EncodedTokenContext';
import { TokenContext } from '../context/TokenContext';

interface Car {
  make: string,
  model: string,
  year: number,
}

interface CarDisplayProps {
  menuOpen: boolean,
}

const CarDisplay = ({menuOpen} : CarDisplayProps) => {
  const tokenEncoded = useContext(EncodedTokenContext);
  const token = useContext(TokenContext);
  const [carData, setCarData] = useState<Car[]>();

  const loadData = async () => {
    if (!token) return;
    const res = await api(tokenEncoded).vehicle.getCars(token?.id);
    if (res.error) {
      console.error(res.error);
      return;
    }
    setCarData(res.data);
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <div className={`w-4/5 md:w-2/5 ${menuOpen ? '-z-10' : 'z-10'}`}>
      {carData?.map((car: Car) => {
        return (
          <div key={car.model} className='card shadow-xl bg-base-100 md:w-96 my-4'>
            <div className='card-body'>
              <span className='text-xl font-bold'>Make: <span className='font-semibold'>{car.make}</span></span>
              <span className='text-xl font-bold'>Model: <span className='font-semibold'>{car.model}</span></span>
              <span className='text-xl font-bold'>Year: <span className='font-semibold'>{car.year}</span></span>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default CarDisplay;