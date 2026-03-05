import { useRef, useEffect } from "react"
import { createChart, type IChartApi, type CandlestickData, CandlestickSeries } from "lightweight-charts"

type Props = {
  candles: CandlestickData[]
}

export default function LightWeightCandles({ candles }: Props) {
    if (!candles || candles.length === 0) {
    return <div>No chart data.</div>}

    const containerRef= useRef<HTMLDivElement |null>(null)
    const chartRef = useRef<IChartApi | null>(null)

    useEffect(()=>{
        if(!containerRef.current) return;
        const chart =createChart(containerRef.current, {
            width : containerRef.current.clientWidth,
            height: 400,
            layout: { background: { color: "#ffffff" }, textColor: "#222" },
            grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
            rightPriceScale: { borderColor: "#ccc" },
            timeScale: { borderColor: "#ccc" },
        })
    
    
        chartRef.current = chart;

        const series = chart.addSeries(CandlestickSeries);

 

        series.setData(candles);
        chart.timeScale().fitContent();

    const onResize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
    };
    }, [candles])

return (
    <div ref={containerRef} style={{width:"100%", maxWidth:900}} />
)
}
