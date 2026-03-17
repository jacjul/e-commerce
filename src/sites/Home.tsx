
import CandleSticks from "../components/CandleSticks"
import MultipleStocks from "../components/MultipleStocks"
import {useAuth} from "../components/context/AuthContext"
import Favorites from "../components/Favorites"
import ModalCompany from "./PortalSymbol"
import {useState} from "react"

const Home = () => {

 const {isAuthenticated} =useAuth()
 const [isOpenModal, setIsOpenModal] =useState<boolean>(false)
 const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL")

 const closeModal = function(){
  console.log("close modal")
 }
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <CandleSticks />
      </div>
      <div className="lg:col-span-3">
        <MultipleStocks />
      </div>
      {isAuthenticated && (
        <div className="lg:col-span-2">
          <Favorites />
        </div>
      )}
      <button onClick={()=>setIsOpenModal(prev => !prev)}>Open Modal</button>
      {isOpenModal && <ModalCompany isOpen ={isOpenModal} onClose={()=>setIsOpenModal(false)} symbol={selectedSymbol}/>}
    </div>
  )
}

export default Home