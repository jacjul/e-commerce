import React from 'react'
import type {StocksData} from "./MultipleStocks"
import SymbolIndicator from "./SymbolIndicator"
import {useAuth} from "./context/AuthContext"
import {useSymbol} from "./context/SymbolContext"
type SingleStockProps ={
    stock:StocksData
    stockImage?: Record<string,string>
    addToFavorites: (symbol:string)=>void
    onSelectStock:(symbol:string) =>void
    
}
const SingleStock = ({stock,stockImage, addToFavorites, onSelectStock}:SingleStockProps) => {
  
  const {isAuthenticated} =useAuth()
  return (
    <div className="rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-800/60">
    <div className="grid grid-cols-[1.2fr_auto_auto] items-center gap-3 lg:grid-cols-[1fr_1.2fr_1fr_1fr_0.5fr_0.5fr]">
      {stockImage &&<img src={Object.values(stockImage)[0]} alt={stock.symbol} className="w-6 h-6"/>}
        <button onClick={()=>onSelectStock(stock.symbol)} className="label-primary truncate">{stock.symbol}</button>
        {(stock.symbol ==="up" ||  stock.symbol ==="up_much")? 
          <div className="value-text font-medium text-emerald-400">{Math.trunc(stock.day*100)/100}</div>:
        <div className="value-text font-medium text-rose-400">{Math.trunc(stock.day*100)/100}</div>}

        <div className="value-text hidden md:block text-slate-300 ">{Math.trunc(stock.pct_week*100)/100}</div>
        <SymbolIndicator direction={stock.week_indicator} />
        {isAuthenticated &&<button onClick={()=>addToFavorites(stock.symbol)} className="control-base control-icon hidden md:inline-flex">+</button>}
    </div>
    </div>
  )
}

export default SingleStock