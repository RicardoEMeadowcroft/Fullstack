import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  if (text == "positive") {
    return (
      <tr>
        <td>{text}</td>
        <td>{value} % </td>
      </tr>
    )
  }
  else {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
  }
}

const Statistics = ({good, bad, neutral}) => {
  
  if (good > 0 || bad > 0 || neutral > 0) {
    const all = good + bad + neutral

    const average = (good - bad) / all

    const positive = good / all

    return (
      <table>
        <tbody>
          <StatisticLine text="good" value ={good} />
          <StatisticLine text="neutral" value ={neutral} />
          <StatisticLine text="bad" value ={bad} />
          <StatisticLine text="all" value ={all} />
          <StatisticLine text="average" value ={average} />
          <StatisticLine text="positive" value ={positive} />
        </tbody>
      </table>
    )
  }
  else {
    return (
      <div>
        No feedback given
      </div>
    )
  }
}

const Button = ({text, onClick}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => setGood(good+1)
  const addNeutral = () => setNeutral(neutral+1)
  const addBad = () => setBad(bad+1)

  return (
    <div>
      <h1>give feedback</h1>

      <Button text="good" onClick={addGood}/>
      <Button text="neutral" onClick={addNeutral}/>
      <Button text="bad" onClick={addBad}/>

      <h1>statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App