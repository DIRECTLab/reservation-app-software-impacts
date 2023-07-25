import { createContext } from "react";
import Token from "../types/Token";
import useToken from "../hooks/useToken";


export const TokenContext = createContext<Token | null>(null);