import {useQuery} from "@tanstack/react-query"
import {getAPI} from "../apiCalls"
import type { CandlestickData, UTCTimestamp} from "lightweight-charts"
import LightWeightCandles from "../components/LightWeightCandles"

type ApiRow ={
  symbol :string
  time : number 
  open:number
  high:number
  low:number
  close: number
}
const Home = () => {

  const {data: candles =[],isPending,error} = useQuery({
    queryKey: ["preload"] ,
    queryFn : async ():Promise<ApiRow[]> =>{
      const response = await getAPI("/api/stock_data/general/AAPL")
      if (!response.success || !Array.isArray(response.message)) {
        throw new Error(typeof response.message === "string" ? response.message : "Invalid API response")
      }
      return response.message
    },
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

  console.log(candles)
  if (isPending){return (<div>Is Pending</div>)}
  if (error){return (<div>Following error occured: {error.message}</div>)}
  if (!candles.length) return <div>No candle data available.</div>

  return (
    <div>Home
      <LightWeightCandles candles={candles}/> 
    </div>
  )
}

export default Home