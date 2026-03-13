import {useQuery} from "@tanstack/react-query"
import {getAPI} from "../apiCalls"
import type { CandlestickData, UTCTimestamp} from "lightweight-charts"
import LightWeightCandles from "../components/LightWeightCandles"
import type {ChangeEvent} from "react"
import {useMemo, useState} from "react"

type TimeRange = "1W" | "1M" | "1Y" | "ALL"

type ApiRow ={
  symbol :string
  time : number 
  open:number
  high:number
  low:number
  close: number
}
const CandleSticks = () => {

  const [currentSymbol,setCurrentSymbol] =useState<string>("AAPL")
  const [timeRange, setTimeRange] = useState<TimeRange>("1M")
  

  const {data:symbols,isPending:symbolsPending, error:symbolsError} = useQuery({
    queryKey : ["symbols"],
    queryFn: async ():Promise<string[]>=>{
      const response = await getAPI("/api/stock_data/symbols")
      return response.message
    },
    staleTime: 1000 *60*60
  })

  const {data: candles =[],isPending,error} = useQuery({
    queryKey: ["candles", currentSymbol],
    queryFn : async ():Promise<ApiRow[]> =>{
      const response = await getAPI(`/api/stock_data/general/${currentSymbol}`)
      if (!response.success || !Array.isArray(response.message)) {
        throw new Error(typeof response.message === "string" ? response.message : "Invalid API response")
      }
      return response.message
    },
    enabled: !!currentSymbol,
    select: (rows):CandlestickData[]=>
      rows.map((row)=>({
        time: Number(row.time) as UTCTimestamp,
        open: Number(row.open),
        high: Number(row.high),
        low: Number(row.low),
        close: Number(row.close),
      }))
      .sort((a,b)=>(a.time as number)-(b.time as number))
  })


  function handleSelectChange(e:ChangeEvent<HTMLSelectElement>){
    setCurrentSymbol(e.target.value)
  }


  const filteredCandles = useMemo(() => {
    if (timeRange === "ALL") return candles
      
    const latestTime = candles[candles.length - 1]?.time as number | undefined
    if (!latestTime) return candles

    const secondsBackByRange: Record<Exclude<TimeRange, "ALL">, number> = {
      "1W": 7 * 24 * 60 * 60,
      "1M": 30 * 24 * 60 * 60,
      "1Y": 365 * 24 * 60 * 60,
    }

    const startTime = latestTime - secondsBackByRange[timeRange]
    return candles.filter((candle) => (candle.time as number) >= startTime)
  }, [candles, timeRange])

  if (isPending ||symbolsPending){return (<div>Is Pending</div>)}
  if (error || symbolsError){return (<div>Following error occured: {error?.message ||symbolsError?.message}</div>)}
  if (!candles.length) return <div>No candle data available.</div>

  return (
    <div className="card-shell h-full">
      <div className="card-content">
      <div className="section-separator flex flex-wrap items-center justify-between gap-3" >
      <select id="selectSymbol" name="selectSymbol" className="control-base min-w-28" value={currentSymbol} onChange={handleSelectChange}>
        {symbols?.map(symbol => <option className="bg-slate-800 text-slate-100" value={symbol} key={symbol}>{symbol}</option>)}
      </select>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setTimeRange("1W")} className="control-base" disabled={timeRange === "1W"}>1W</button>
        <button type="button" onClick={() => setTimeRange("1M")} className="control-base" disabled={timeRange === "1M"}>1M</button>
        <button type="button" onClick={() => setTimeRange("1Y")} className="control-base" disabled={timeRange === "1Y"}>1Y</button>
        <button type="button" onClick={() => setTimeRange("ALL")} className="control-base" disabled={timeRange === "ALL"}>ALL</button>
      </div>
      </div>
      <LightWeightCandles candles={filteredCandles}/> 
      </div>
    </div>
  )
}

export default CandleSticks