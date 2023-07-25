import { useState, createContext, ReactNode } from 'react';

export enum AlertType {
  SUCCESS = 'alert-success',
  ERROR = 'alert-error',
  WARNING = 'alert-warning',
  INFO = 'alert-info'
};

export interface AlertObject {
  type: AlertType,
  text: string,
  setAlertMessage: (severity: AlertType, message: string, time: number | null) => void,
}

const AlertContext = createContext<AlertObject>({
  type: AlertType.SUCCESS,
  text: '',
  setAlertMessage: () => {}
});

const AlertProvider = ({ children } : { children?: ReactNode }) => {
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState(AlertType.ERROR);

  const setAlertMessage = (severity: AlertType, message: string, time: number | null) => {
    setAlert(message);
    setAlertType(severity);
    setTimeout(() => {
      setAlert('');
    }, time ?? 3000);
  }

  return (
    <AlertContext.Provider
      value={{
        type: alertType,
        text: alert,
        setAlertMessage: setAlertMessage,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export { AlertProvider };
export default AlertContext;