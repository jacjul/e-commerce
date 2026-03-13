
import CandleSticks from "../components/CandleSticks"
import MultipleStocks from "../components/MultipleStocks"
import {useAuth} from "../components/context/AuthContext"
import Favorites from "../components/Favorites"
const Home = () => {

 const {isAuthenticated} =useAuth()

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
    </div>
  )
}

export default Home