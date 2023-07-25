import axios, { AxiosError, AxiosResponse } from 'axios';
import Reservation from '../types/Reservation';
import ReservationRes from '../types/apiResTypes/ReservationRes';
import LoginRes from '../types/apiResTypes/LoginRes';
import LoginData from '../types/user/LoginData';
import ChargerRes from '../types/apiResTypes/ChargerRes';
import OptimalChargeRangeRes from '../types/apiResTypes/OptimalChargeRangeRes';
import DeletePatchRes from '../types/apiResTypes/DeletePatchRes';
import ReserveData from '../types/ReserveData';
import ReserveRes from '../types/apiResTypes/ReserveRes';
import User from '../types/user/User';
import UserRes from '../types/apiResTypes/UserRes';
import CreateUserData from '../types/user/CreateUserData';
import CreateUserRes from '../types/apiResTypes/CreateUserRes';
import SpendTokenData from '../types/user/SpendTokenData';
import ReservationCostRes from '../types/apiResTypes/ReservationCostRes';
import CarRes from '../types/apiResTypes/CarRes';
import CreateCarData from '../types/CreateCarData';


const api = (authorization: string) => {
  const instance = axios.create({
    baseURL: 'http://localhost:11236',
    headers: { Authorization: authorization }
  });

  function responseBody<T>(response: AxiosResponse<T>) {
    return response.data;
  }

  instance.interceptors.response.use((res) => { return res; }, (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        console.error(data);
        return data;
      case 401:
        console.error("unauthorised");
        break;
      case 404:
        console.error("404 error");
        break;
      case 500:
        console.error("Server had an error");
        break;
    }
    return data;
  });

  instance.interceptors.request.use((config) => {
    if (authorization) {
      config.headers.Authorization = authorization;
    }
    return config;
  });

  return {
    getChargers: () => instance.get<ChargerRes>("charger").then(responseBody),
    charger: {
      getOptimalChargeRange: (id: number, startTime: string) => instance.get<OptimalChargeRangeRes>("charger/optimal-range", { params: { id: id, startTime: startTime } }).then(responseBody),
      getCost: (id: number, startTime: string, chargeAmount: number) => instance.get<ReservationCostRes>("charger/cost", {params: {id, startTime, chargeAmount}}).then(responseBody),
    },
    reservation: {
      getCurrent: (id: number) => instance.get<ReservationRes>('/reservation/current', { params: { UserId: id, startDate: new Date(), all: true } }).then(responseBody<ReservationRes>),
      getUpcoming: (id: number) => instance.get<ReservationRes>('/reservation', { params: { UserId: id, upcoming: true } }).then(responseBody<ReservationRes>),
      delete: (id: number) => instance.delete<DeletePatchRes>("/reservation", { data: { id: id } }).then(responseBody),
      reserve: (data: ReserveData) => instance.post<ReserveRes>("/reservation", {...data}).then(responseBody),
    },
    user: {
      getUser: (userId: number) => instance.get<UserRes>("/user", {params: {id: userId}}).then(responseBody),
      spendTokens: (data: SpendTokenData) => instance.patch<DeletePatchRes>("user/spend-tokens", {...data}).then(responseBody),
    },
    login: (data: LoginData) => instance.post<LoginRes>('/user/login', { ...data }).then(responseBody),
    createUser: (data: CreateUserData) => instance.post<CreateUserRes>('user', {...data}).then(responseBody),
    getAllChargerReservations: (id: number, datetime: Date) => instance.get<ReservationRes>("reservation/reserved_times", {params: {chargerId: id, date: datetime}}).then(responseBody),
    vehicle: {
      getCars: (userId: number) => instance.get<CarRes>('/car', {params: {UserId: userId}}).then(responseBody),
      addCar: (data: CreateCarData) => instance.post<CarRes>('/car', {...data}).then(responseBody),
    }
  }
}

export default api;