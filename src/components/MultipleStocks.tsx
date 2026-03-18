import React from 'react'
import {useState,useEffect,useMemo} from "react"
import {useQuery,useMutation, useQueryClient} from "@tanstack/react-query"
import {getAPI, postAPI} from "../apiCalls"
import SingleStock from "./SingleStock"
import {useAuth} from "./context/AuthContext"
import {getTickerLogos} from "../helper_images"
export type StocksData ={
    symbol : string
    day: number
    week: number
    month: number
    pct_week: number
    pct_month: number
    week_indicator: string
    month_indicator: string
}

const MultipleStocks = ({onSelectStock}:{onSelectStock:(symbol:string)=>void}) => {
    const queryClient = useQueryClient()
    const [currentIndex,setCurrentIndex] =useState<number>(0)
    const {accessToken,isAuthenticated} =useAuth()

    const [logos, setLogos] = useState<Record<string,string>>({})

    const {data:stocks, isPending,error} = useQuery({
        queryKey: ["stocks"],
        queryFn : async ():Promise<StocksData[]> =>{
            const response = await getAPI("/api/stock_data/allStocks")
            return response.message
        },
        staleTime: 1000*60*5 //5 min
    })

    const visibleStocks = stocks?.slice(currentIndex,currentIndex+10) ?? []
    const visibleStocksSymbols = useMemo(()=> visibleStocks.map(s =>s.symbol),[visibleStocks])

    useEffect(()=>{
        let cancelled =false
        async function loadMissingImages(){
            const missing = visibleStocksSymbols.filter(sym => sym !=logos[sym])
            if (!missing.length) return

            const loaded = await getTickerLogos(missing)
            setLogos(prev => ({...prev, ...loaded}))
        };
        loadMissingImages();
        return ()=> {cancelled =true}
    }, [visibleStocks])



    const mutation = useMutation({
        mutationFn: async (add_symbol:string)=>{
            const response =await postAPI(`/api/stock_data/favorites/${add_symbol}`,accessToken)
        },
        onSuccess: ()=> queryClient.invalidateQueries({queryKey:["favorites"]})
    })
    
    function addToFavorites(symbol:string){
        mutation.mutate(symbol)
    }

    

        
    if (isPending){return(<div className="card-shell card-content text-sm text-slate-300">Is pending</div>)}
    if (error){return(<div className="card-shell card-content text-sm text-rose-200">Following error occured : ${error.message}</div>)}

    const hasNext = (stocks && (currentIndex +10) <stocks.length)? false : true
    const hasBefore = (stocks && currentIndex >=10)? false: true
  return (
        <div className="card-shell h-full w-full">
            <div className="card-content">
                <button onClick={()=>setCurrentIndex(prev =>prev-10)} disabled={hasBefore} className="control-base w-full" >
            ^
        </button>
                <div className="header-row section-separator grid grid-cols-[1.2fr_auto_auto] items-center gap-3 px-3 md:grid-cols-[1fr_1.2fr_1fr_1fr_0.8fr_0.6fr]">
            {isAuthenticated?<><span>Image</span><span>Symbol</span><span>Day</span><span className="hidden md:block">Week %</span><span className="hidden md:block">Trend</span><span className="hidden md:block">Add</span></>:
           <> <span>Image</span><span>Symbol</span><span>Day</span><span className="hidden md:block">Week %</span><span className="hidden md:block">Trend</span></>}
        </div>
        <div className="divide-y divide-slate-800/80 px-1 py-1">
            {stocks.slice(currentIndex,currentIndex+10).map(
                stock =><SingleStock key={stock.symbol} stock={stock} onSelectStock={onSelectStock} stockImage={logos[stock.symbol]} addToFavorites={addToFavorites}/>)}
        </div>
        
                <button onClick={()=>setCurrentIndex(prev =>prev+10)} disabled={hasNext} className="control-base w-full" >
            v
        </button>
            </div>
    </div>
  )
}

export default MultipleStocks