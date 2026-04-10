import { useState } from "react"
import type {Dispatch, SetStateAction} from "react"
type LessonStep = {
  id: string
  term: string
  short: string
  explanation: string
  example?: string
}

const IncomeStatement = ({setStepFundamental}:{setStepFundamental:Dispatch<SetStateAction<number>>}) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
const [isClickedBalanceSheet, setIsClickedBalanceSheet] = useState<boolean>(false)
  const steps: LessonStep[] = [
    {
      id: "revenue",
      term: "Revenue",
      short: "Total money from selling products/services before costs.",
      explanation:
        "Revenue is the top line of the income statement. It tells you how much money came in from core business activities.",
      example: "Revenue is 28.9. Growth vs 2024 is 28.9 - 20.8 = 8.1."
    },
    {
      id: "COGS",
      term: "Cost of Goods Sold (COGS)",
      short: "Direct costs tied to producing goods or delivering services.",
      explanation:
        "COGS includes costs like raw materials, manufacturing, and direct labor. It is subtracted from revenue to calculate gross profit.",
      example: "COGS is 16.0, shown with an illustrative breakdown into materials, labor, and freight."
    },
    {
      id: "grossProfit",
      term: "Gross Profit",
      short: "Revenue minus direct production costs.",
      explanation:
        "Gross profit shows how much remains after paying costs directly tied to producing goods/services.",
      example: "Gross Profit = Revenue - COGS = 28.9 - 16.0 = 12.9."
    },
    {
      id: "operatingExpenses",
      term: "Operating Expenses",
      short: "Ongoing costs required to run the business.",
      explanation:
        "Operating expenses include items like salaries, rent, marketing, SG&A, and R&D that are not direct production costs.",
      example: "Operating Expenses = SG&A (proxy) 7.4 + R&D 2.3 = 9.7."
    },
    {
      id: "operatingIncome",
      term: "Operating Income",
      short: "Profit generated from core operations.",
      explanation:
        "Operating income is gross profit minus operating expenses. It shows how profitable the core business is before interest and taxes.",
      example: "Operating Income = Gross Profit - Operating Expenses = 12.9 - 9.7 = 3.2."
    },
    {
      id: "interest",
      term: "Interest",
      short: "Cost of debt financing or income from cash balances.",
      explanation:
        "Interest reflects borrowing costs (or, less commonly, interest income). It is included below operating income to reach pretax income.",
      example: "Net interest rounds to 0.0 in each year at one decimal, but the underlying values are slightly negative."
    },
    {
      id: "totalNonOperatingIncomeExpense",
      term: "Total Non-Operating Income/Expense",
      short: "Items below operating income, including interest and other non-operating effects.",
      explanation:
        "This line combines net interest with other non-operating gains/losses. Adding it to operating income gives pretax income.",
      example: "2025 bridge: Pretax Income = Operating Income + Total Non-Operating Income/Expense = 3.2 + (-0.4) = 2.8 (rounded)."
    },
    {
      id: "pretaxIncome",
      term: "Pretax Income",
      short: "Earnings before income tax is applied.",
      explanation:
        "Pretax income equals operating income plus or minus non-operating items such as interest. It is the base for calculating taxes.",
      example: "Pretax Income is 2.8, and pretax margin is 2.8 / 28.9 = 9.7%."
    },
    {
      id: "incomeTax",
      term: "Income Tax",
      short: "Taxes owed on pretax earnings.",
      explanation:
        "Income tax is the amount paid to tax authorities based on taxable profit. Subtracting it from pretax income gives net income.",
      example: "Income Tax = 0.8, so effective tax rate is 0.8 / 2.8 = 28.6%."
    },
    {
      id: "netIncome",
      term: "Net Income",
      short: "Final profit after all costs and taxes.",
      explanation:
        "Net income is the amount of money left after paying all costs, interest, and taxes.",
      example: "Net margin = 2.0 / 28.9 = 6.9%."
    }
  ]

  const activeId = steps[currentStep].id

  const getMainRowClass = (id: string, emphasize = false) =>
    [
      "[&>td]:px-4",
      "[&>td]:py-3",
      "[&>td]:align-middle",
      "[&>td]:transition-colors",
      "[&>td:first-child]:rounded-l-lg",
      "[&>td:last-child]:rounded-r-lg",
      "[&>td:not(:first-child)]:text-right",
      emphasize ? "[&>td]:font-semibold" : "",
      activeId === id ? "[&>td]:bg-rose-100 [&>td]:text-rose-900" : "[&>td]:bg-white [&>td]:text-slate-800"
    ].join(" ")

  const detailRowClass = [
    "[&>td]:px-4",
    "[&>td]:py-2",
    "[&>td]:text-sm",
    "[&>td:first-child]:pl-8",
    "[&>td:first-child]:text-slate-600",
    "[&>td:not(:first-child)]:text-right",
    "[&>td]:bg-slate-50"
  ].join(" ")

  const gotoBalanceSheet = ()=>{
    if (isClickedBalanceSheet) return
    setStepFundamental(1)
    setIsClickedBalanceSheet(true)
  }
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Income Statement Tutorial</h2>
        <p className="mt-2 text-sm text-slate-600">Mercado Libre annual data (2023-2025), values in USD billions.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3 shadow-sm md:p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-1">
              <thead>
                <tr className="[&>th]:px-4 [&>th]:pb-2 [&>th]:text-xs [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-wide [&>th]:text-slate-500">
                  <th className="text-left">Line Item</th>
                  <th className="text-right">2023</th>
                  <th className="text-right">2024</th>
                  <th className="text-right">2025</th>
                </tr>
              </thead>
              <tbody>
                <tr className={getMainRowClass("revenue")}>
                  <td>Revenue</td>
                  <td>15.1</td>
                  <td>20.8</td>
                  <td>28.9</td>
                </tr>

                <tr className={getMainRowClass("COGS")}>
                  <td>Cost of Goods Sold (COGS)</td>
                  <td>7.5</td>
                  <td>11.2</td>
                  <td>16.0</td>
                </tr>
                {activeId === "COGS" && (
                  <>
                    <tr className={detailRowClass}>
                      <td>Raw Materials</td>
                      <td>4.3</td>
                      <td>6.4</td>
                      <td>9.1</td>
                    </tr>
                    <tr className={detailRowClass}>
                      <td>Direct Labor</td>
                      <td>2.3</td>
                      <td>3.4</td>
                      <td>4.8</td>
                    </tr>
                    <tr className={detailRowClass}>
                      <td>Freight and Packaging</td>
                      <td>1.0</td>
                      <td>1.5</td>
                      <td>2.1</td>
                    </tr>
                  </>
                )}

                <tr className={getMainRowClass("grossProfit", true)}>
                  <td>Gross Profit</td>
                  <td>7.6</td>
                  <td>9.6</td>
                  <td>12.9</td>
                </tr>
                <tr className={getMainRowClass("operatingExpenses")}>
                  <td>Operating Expenses</td>
                  <td>5.4</td>
                  <td>6.9</td>
                  <td>9.7</td>
                </tr>
                {activeId === "operatingExpenses" && (
                  <>
                    <tr className={detailRowClass}>
                      <td>SG&amp;A (Proxy)</td>
                      <td>3.6</td>
                      <td>5.0</td>
                      <td>7.4</td>
                    </tr>
                    <tr className={detailRowClass}>
                      <td>R&amp;D</td>
                      <td>1.8</td>
                      <td>1.9</td>
                      <td>2.3</td>
                    </tr>
                  </>
                )}

                <tr className={getMainRowClass("operatingIncome", true)}>
                  <td>Operating Income</td>
                  <td>2.2</td>
                  <td>2.6</td>
                  <td>3.2</td>
                </tr>
                <tr className={getMainRowClass("interest")}>
                  <td>Interest</td>
                  <td>0.0</td>
                  <td>0.0</td>
                  <td>0.0</td>
                </tr>
                <tr className={getMainRowClass("totalNonOperatingIncomeExpense")}>
                  <td>Total Non-Operating Income/Expense</td>
                  <td>-0.7</td>
                  <td>-0.2</td>
                  <td>-0.4</td>
                </tr>
                <tr className={getMainRowClass("pretaxIncome", true)}>
                  <td>Pretax Income</td>
                  <td>1.6</td>
                  <td>2.4</td>
                  <td>2.8</td>
                </tr>
                <tr className={getMainRowClass("incomeTax")}>
                  <td>Income Tax</td>
                  <td>0.6</td>
                  <td>0.5</td>
                  <td>0.8</td>
                </tr>
                <tr className={getMainRowClass("netIncome", true)}>
                  <td>Net Income</td>
                  <td>1.0</td>
                  <td>1.9</td>
                  <td>2.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-slate-100 shadow-lg lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-3 inline-flex rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            Step {currentStep + 1} of {steps.length}
          </div>
          <h3 className="text-2xl font-semibold leading-tight">{steps[currentStep].term}</h3>
          <p className="mt-2 text-sm text-slate-300">{steps[currentStep].short}</p>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm leading-relaxed text-slate-200">
            {steps[currentStep].explanation}
          </div>

          <div className="mt-4 rounded-xl bg-rose-500/15 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-rose-200">Example 2025</div>
            <p className="mt-1 text-sm text-rose-100">{steps[currentStep].example}</p>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
              className="rounded-lg border border-slate-500 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <div className="text-sm tabular-nums text-slate-300">
              {currentStep + 1}/{steps.length}
            </div>
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={currentStep >= steps.length - 1}
              className="rounded-lg border border-slate-500 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
            <button
                onClick={()=>{gotoBalanceSheet()}}
                className="w-full mt-5 rounded-lg border border-slate-500 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={isClickedBalanceSheet}>
                Go to Balance Sheet
            </button>
        </aside>
      </div>
    </section>
  )
}

export default IncomeStatement