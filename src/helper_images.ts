type Loader = ()=>Promise<string>

const rawLoader = import.meta.glob("./assets/ticker-logos/ticker_icons/*.{png,jpg}") as Record <string,Loader>

const FALLBACK_SYMBOL = "placeholder"

const symbolLoader :Record<string,Loader> = Object.fromEntries(
    Object.entries(rawLoader).map(([path,loader])=>{
        const file = path.split("/").pop() ?? ""
        const symbol = file.split(".")[0].toUpperCase()
        return [symbol,loader]
    })
)

export async function getTickerLogo(symbol:string):Promise<string>{
    const loader = symbolLoader[symbol]

    if (loader)return loader()

    else{
        const fallback = symbolLoader[FALLBACK_SYMBOL]
        return fallback? fallback(): "Fallback didn't work"
    }
}

export async function getTickerLogos(symbols:string[]): Promise<Record<string,string>>{
    const unique = Array.from(new Set(symbols.map(s =>s.toUpperCase())))
    const entries = await Promise.all(unique.map(async symbol =>[symbol , await getTickerLogo(symbol)]))
    
    return Object.fromEntries(entries)
}




