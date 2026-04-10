import React from 'react'
import SectionTable from "./SectionTable"
type AssetProps ={
  name: string
  cash : number
  receivables : number
  inventory : number
  otherCurrentAssets : number
  totalCurrentAssets : number
  propertyPlantEquipment : number
  longtermInvestments : number
  goodwill : number
  otherLongtermAssets: number
  totalLongtermAssets: number
  totalAssets:number
}
type LiabilityEquityProps = {
  name: string
  totalCurrentLiabilities : number
  longtermDebt: number
  noncurrentLiabilities: number
  totalLongtermLiabilities:number
  totalLiabilities:number
  retainedEarnings:number
  commonStock:number
  totalEquity:number
  totalLiabilitiesEquity:number

}
const BalanceSheet = () => {

  const assets:AssetProps = {name: "Assets", cash:16.2, receivables:16.1, inventory:0.6,
      otherCurrentAssets : 0.7,
      totalCurrentAssets : 33.6,
      propertyPlantEquipment : 2.3,
      longtermInvestments : 1.7,
      goodwill : 0.2,
      otherLongtermAssets: 0.4,
      totalLongtermAssets: 9.1,
      totalAssets:42.7
   }
  const liabilityEquity:LiabilityEquityProps={
      name : "Liabilities & Equity",
      totalCurrentLiabilities : 28.6,
      longtermDebt: 4.5,
      noncurrentLiabilities: 0.6,
      totalLongtermLiabilities:7.3,
      totalLiabilities:35.9,
      retainedEarnings:5.8,
      commonStock:0,
      totalEquity:6.7,
      totalLiabilitiesEquity:42.7,
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionTable section={assets}/>
      <SectionTable section={liabilityEquity}/> 
    </div>
  )
}

export default BalanceSheet