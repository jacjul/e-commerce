import {useState} from "react"
import BalanceSheet from "../components/tutorial/BalanceSheet"
import IncomeStatement from "../components/tutorial/IncomeStatement"
const FundamentalsTutorial = () => {

    const [stepFundamental, setStepFundamental] = useState<number>(0)

  return (
    <div>
        {stepFundamental === 0 &&<IncomeStatement setStepFundamental={setStepFundamental}/>}
        {stepFundamental ===1 &&<BalanceSheet />}
    </div>
  )
}

export default FundamentalsTutorial