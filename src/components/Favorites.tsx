import React from 'react'
import {useQuery,useQueryClient,useMutation} from "@tanstack/react-query"
import {getAPI} from "../apiCalls"
import {useAuth} from "./context/AuthContext"
import {postAPI} from "../apiCalls"

const Favorites = () => {
    const {accessToken} =useAuth()

        const {data:favorite_symbols =[],isPending,error} = useQuery<string[]>({
        queryKey: ["favorites"],
        queryFn : async ()=>{
            const res = await getAPI("/api/stock_data/favorites", accessToken)
            return res.message
        }
    })
    const queryClient = useQueryClient()
    const deleteFavMutation = useMutation({
        mutationFn: async(fav:string)=>{
            await postAPI(`/api/stock_data/favorites/delete/${fav}`,accessToken)
        },
        onSuccess: async()=>{
            await queryClient.invalidateQueries({queryKey:["favorites"]})
        }
    })
    function deleteFavorite(favorite:string){
        deleteFavMutation.mutate(favorite)

    }
        if (isPending) return <div className="card-shell card-content text-sm text-slate-300">Process Pending</div>
        if (error) return <div className="card-shell card-content text-sm text-rose-200">Following error occured : {error.message}</div>
  return (
        <div className="card-shell h-full w-full">
            <div className="card-content">
                <div className="section-separator">
                    <div className="header-row">Favorites</div>
        </div>
                <div className="flex flex-col gap-2">
                        {favorite_symbols.map((fav:string) =>
                        <div key={fav} className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-slate-800/60">
                                <div className="label-primary truncate">{fav}</div>
                                <button onClick={()=>deleteFavorite(fav)} className="control-base control-icon">-</button>
                        </div>)}
                        {!favorite_symbols.length && <div className="value-text text-slate-300">No favorites yet.</div>}
                </div>
            </div>
    </div>
  )
}

export default Favorites