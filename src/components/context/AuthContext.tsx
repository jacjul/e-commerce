import {createContext, useState, useCallback,useMemo, useEffect,useContext} from "react"

type LoginPayload ={username: string, password:string}
type AccessTokenResponse ={access_token: string, token_type:string}
type AuthProviderProps = {
    accessToken :string |null
    isAuthenticated : boolean
    login : (payload:LoginPayload) =>Promise<void>
    refresh : ()=>Promise<void>
    logout : ()=>void
}

const AuthContext =createContext<AuthProviderProps|undefined>(undefined)

async function loginRequest(payload:LoginPayload):Promise<AccessTokenResponse>{
    const body = new URLSearchParams()
    body.set("username",payload.username)
    body.set("password",payload.password)
    const response = await fetch ("/api/user/login",{
        method :"POST",
        headers : {"Content-Type":"application/x-www-form-urlencoded"},
        body,
        credentials: "include"
        //something missing here? 
    })
    if (!response.ok){throw new Error(`Following error ocurred during login: ${response.status}`)}
    return response.json()
}

async function refreshRequest():Promise<AccessTokenResponse>{
    const response = await fetch("/api/user/refresh",{
        method:"POST",
        credentials: "include"

    })
    if(!response.ok){throw new Error(`Following error occured when trying to get Refreshtoken ${response.status}`)}
    return response.json()
}

export function AuthProvider({children}:{children:React.ReactNode}){
    const [accessToken, setAccessToken] =useState<string|null>(null)
    


    const login = useCallback(async(payload:LoginPayload)=>{
        const data = await loginRequest(payload)
        try{
            setAccessToken ( data.access_token)}
        catch (err){
            `Following error occured: ${err}`
        }
    }, [])

    const refresh = useCallback(async()=>{
        const data = await refreshRequest()
        setAccessToken(data.access_token)
    },[])

    const logout = useCallback(()=>{
        setAccessToken(null)
    },[])

    useEffect(()=>{refresh().catch(()=>setAccessToken(null))},[refresh])

    const values = useMemo(()=>({
        accessToken, isAuthenticated: !!accessToken, login, refresh, logout
    }), [accessToken,login,logout,refresh])
      
    
    return(
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
    }

    export function useAuth(){
        const ctx = useContext(AuthContext);
        if (!ctx) throw new Error(`useAuth must be used inside Authprovider`)
        return ctx;
    }


