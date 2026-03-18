import {useContext, createContext, useState} from "react"


export const SymbolContext =createContext({})

export const  useSymbol = ()=> useContext(SymbolContext)

export function SymbolProvider({children}){
    const [currentSymbol,setCurrentSymbol] = useState<string>("AAPL")

    const contextValues ={
        currentSymbol , setCurrentSymbol
    }

    return (
        <SymbolContext.Provider value={contextValues} >
            {children}
        </SymbolContext.Provider>
    )
}