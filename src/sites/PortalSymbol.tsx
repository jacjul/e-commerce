import {createPortal} from "react-dom"
import {useQuery} from "@tanstack/react-query"
import {getAPI} from "../apiCalls"
import {useAuth} from "../components/context/AuthContext"
import {getTickerLogo} from "../helper_images"
import {useEffect, useState} from "react"

type ModalCompanyProps ={
    isOpen: boolean
    onClose : ()=>void
    symbol : string
}

type CompanyProfile = {
    symbol?: string
    short_name?: string
    long_name?: string
    quote_type?: string
    exchange?: string
    currency?: string
    website?: string
    sector?: string
    industry?: string
    country?: string
    city?: string
    state?: string
    full_time_employees?: number
    market_cap?: number
    enterprise_value?: number
    total_revenue?: number
    ebitda?: number
    revenue_growth?: number
    gross_margins?: number
    operating_margins?: number
    profit_margins?: number
    free_cashflow?: number
    trailing_pe?: number
    forward_pe?: number
    peg_ratio?: number
    price_to_book?: number
    trailing_eps?: number
    forward_eps?: number
    return_on_equity?: number
    return_on_assets?: number
    debt_to_equity?: number
    current_ratio?: number
    quick_ratio?: number
    dividend_rate?: number
    dividend_yield?: number
    payout_ratio?: number
    ex_dividend_date?: string
    beta?: number
    shares_outstanding?: number
    average_volume?: number
    fifty_two_week_high?: number
    fifty_two_week_low?: number
    fifty_day_average?: number
    two_hundred_day_average?: number
}

const infoClass = "rounded-md border border-gray-200 bg-white p-3"
const labelClass = "text-xs font-semibold uppercase tracking-wide text-gray-500"
const valueClass = "mt-1 text-base font-medium text-gray-900"

function formatNumber(value?: number | null) {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(value)
}

function formatMoney(value?: number | null) {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value)
}

function formatPercent(value?: number | null) {
    if (value === null || value === undefined) return "-"
    return `${(value * 100).toFixed(2)}%`
}

function formatDate(value?: string | null) {
    if (!value) return "-"
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return "-"
    return parsed.toLocaleDateString("en-US")
}

export default function ModalCompany({isOpen, onClose,symbol}:ModalCompanyProps){
    if (!isOpen) return null
    const modalRoot = document.getElementById("modal")
    if (!modalRoot) return null

    const [currentImage, setCurrentImage] = useState<string | null>(null)
    useEffect(() => {
        let isMounted = true
        async function loadLogo() {
            const image = await getTickerLogo(symbol)
            console.log(image)
            if (isMounted) setCurrentImage(image)
        }
        void loadLogo()
        return () => {
            isMounted = false
        }
    }, [symbol])
    
    
    const {accessToken} = useAuth()
    const {data, isPending, error} = useQuery({
        queryKey : ["symbol" , symbol],
        queryFn : async ()=>{
            const response = await getAPI(`/api/stock_data/info/${symbol}`, accessToken)
            return response.message
        },
        staleTime : 1000*60*60
    })

    const symbolData: CompanyProfile | null = Array.isArray(data) ? (data[0] ?? null) : (data ?? null)

    return(
        createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="max-h-[85vh] w-[95vw] max-w-5xl overflow-y-auto rounded-xl bg-gray-100 p-5 shadow-xl">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex flex-row items-center justify-start gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{symbolData?.long_name ?? symbol}</h2>
                            <p className="text-sm text-gray-600">
                                {symbolData?.short_name ?? "-"} | {symbolData?.exchange ?? "-"} | {symbolData?.quote_type ?? "-"}
                            </p>
                        </div>
                        {currentImage && (
                            <img src={Object.values(currentImage)[0]} alt={`${symbol} logo`} className="h-12 w-12 rounded-md object-contain" />
                        )}
                        </div>
                        <button onClick={onClose} className="rounded-xl bg-gray-700 px-3 py-1 text-white">Close</button>
                    </div>

                    {isPending && <div className="mb-3 rounded-md bg-white p-3 text-gray-700">Loading company profile...</div>}
                    {error && <div className="mb-3 rounded-md bg-red-100 p-3 text-red-700">{error.message}</div>}

                    {!isPending && !error && symbolData && (
                        <div className="space-y-6">
                            <section>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">General Information</h3>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <div className={infoClass}><div className={labelClass}>Sector</div><div className={valueClass}>{symbolData.sector ?? "-"}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Industry</div><div className={valueClass}>{symbolData.industry ?? "-"}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Employees</div><div className={valueClass}>{formatNumber(symbolData.full_time_employees)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Country</div><div className={valueClass}>{symbolData.country ?? "-"}</div></div>
                                </div>
                            </section>

                            <section>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Key Financials</h3>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <div className={infoClass}><div className={labelClass}>Market Cap</div><div className={valueClass}>{formatMoney(symbolData.market_cap)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Enterprise Value</div><div className={valueClass}>{formatMoney(symbolData.enterprise_value)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Revenue</div><div className={valueClass}>{formatMoney(symbolData.total_revenue)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>EBITDA</div><div className={valueClass}>{formatMoney(symbolData.ebitda)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Free Cashflow</div><div className={valueClass}>{formatMoney(symbolData.free_cashflow)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Average Volume</div><div className={valueClass}>{formatNumber(symbolData.average_volume)}</div></div>
                                </div>
                            </section>

                            <section>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Valuation and Quality</h3>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <div className={infoClass}><div className={labelClass}>Trailing P/E</div><div className={valueClass}>{formatNumber(symbolData.trailing_pe)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Forward P/E</div><div className={valueClass}>{formatNumber(symbolData.forward_pe)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Price to Book</div><div className={valueClass}>{formatNumber(symbolData.price_to_book)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Revenue Growth</div><div className={valueClass}>{formatPercent(symbolData.revenue_growth)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Profit Margin</div><div className={valueClass}>{formatPercent(symbolData.profit_margins)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>ROE</div><div className={valueClass}>{formatPercent(symbolData.return_on_equity)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Debt to Equity</div><div className={valueClass}>{formatNumber(symbolData.debt_to_equity)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Beta</div><div className={valueClass}>{formatNumber(symbolData.beta)}</div></div>
                                </div>
                            </section>

                            <section>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Market and Dividends</h3>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <div className={infoClass}><div className={labelClass}>Dividend Yield</div><div className={valueClass}>{formatPercent(symbolData.dividend_yield)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Payout Ratio</div><div className={valueClass}>{formatPercent(symbolData.payout_ratio)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>Ex Dividend Date</div><div className={valueClass}>{formatDate(symbolData.ex_dividend_date)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>52 Week High</div><div className={valueClass}>{formatNumber(symbolData.fifty_two_week_high)}</div></div>
                                    <div className={infoClass}><div className={labelClass}>52 Week Low</div><div className={valueClass}>{formatNumber(symbolData.fifty_two_week_low)}</div></div>
                                </div>
                            </section>
                        </div>
                    )}

                    {!isPending && !error && !symbolData && (
                        <div className="rounded-md bg-white p-3 text-gray-700">No profile data found for this symbol.</div>
                    )}
                </div>
            </div>,
            modalRoot
        )
    )
}