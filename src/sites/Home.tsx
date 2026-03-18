
import CandleSticks from "../components/CandleSticks"
import MultipleStocks from "../components/MultipleStocks"
import {useAuth} from "../components/context/AuthContext"
import Favorites from "../components/Favorites"
import ModalCompany from "./PortalSymbol"
import {useState} from "react"
import {useSymbol} from "../components/context/SymbolContext"
const Home = () => {

 const {isAuthenticated} =useAuth()
 const [isOpenModal, setIsOpenModal] =useState<boolean>(false)
 const {currentSymbol,setCurrentSymbol} = useSymbol()

 const closeModal = function(){
  console.log("close modal")
 }

 function handleStockSelect(symbol:string){
    setCurrentSymbol(symbol)
    setIsOpenModal(true)

 }
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <CandleSticks />
      </div>
      <div className="lg:col-span-4">
        <MultipleStocks onSelectStock={handleStockSelect}/>
      </div>
      {isAuthenticated && (
        <div className="lg:col-span-2">
          <Favorites onSelectStock={handleStockSelect}/>
        </div>
      )}
      <button onClick={()=>setIsOpenModal(prev => !prev)}>Open Modal</button>
      {isOpenModal && <ModalCompany isOpen ={isOpenModal} onClose={()=>setIsOpenModal(false)} symbol={currentSymbol}/>}
    </div>
  )
}

export default Home