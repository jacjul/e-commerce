import {Link} from "react-router-dom"
import { FaChartLine  } from "react-icons/fa6";
import ThemeButton from "./ThemeButton"

export default function Header (){
    return(
        <div className="flex justify-between bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 px-4 py-2 mb-5">              
        <div className= "flex flex-row ml-10 mt-2">
                <FaChartLine size={26} />
                <div className="pl-2 font-bold text-lg mt-0">... your Stock platform</div>
                <ThemeButton />

            </div>
            <nav className= "flex flex-row g-4 ">
                <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 px-2 py-2" to="/home">Home</Link>
                <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 px-2 py-2" to="/fundamentalLab">FundamentalLab</Link>
                <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 px-2 py-2" to="/fundamentalTutorial">FundamentalTutorial</Link>

                <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 px-2 py-2" to="/profile">Profile</Link>
                <Link className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 px-2 py-2" to="/login">Login</Link>
                
            </nav>
        </div>
    )
}