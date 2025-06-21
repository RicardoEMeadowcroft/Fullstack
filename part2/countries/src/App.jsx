/* eslint-disable no-unused-vars */
import { useState, useEffect} from 'react'

import countryService from './services/countries'

const Country = ({name, showClick}) => {
  return (
    <>
      {name} <button onClick={showClick}>Show</button> <br/>
    </>
  )
}

const CountryList = ({countries, selected, selectCountry}) => {

  if (!countries || selected) {
    return null
  }
  else if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }
  else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <Country key={country.name.common} name={country.name.common} showClick={() => selectCountry(country)}/>
        ))}
      </div>
    )
  }
  else {
    return null
  }

}

const Details = ({country}) => {
  if (!country) {
    return null
  }
  else {

    return (
      <div>
        <h1>{country.name.common}</h1>
        Captal {country.capital} <br/>
        Area {country.area} <br/>

        <h2>Languages</h2>

        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>

        <img src={country.flags.png} alt={country.flags.alt}></img>
      </div>
    )
  }
}

const Weather = ({weather}) => {
  if (!weather) {
    return null
  }
  else {
    console.log(weather)
    return (
      <div>
        <h2>Weather in {weather.name}</h2>
        
        <p>Temperature {weather.main.temp} Celsius</p>

        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}></img>

        <p>Wind {weather.wind.speed} m/s</p>
      </div>
    )
  }
}

const App = () => {
  const [filter, setFilter] = useState("")
  const [countries, setCountries] = useState(null)
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
      .getCountryList()
      .then(list => {setCountries(list)})
  },[])

  useEffect(() => {
    if(selected)
    {
      console.log(selected.capitalInfo.latlng)
      countryService
        .getWeather(selected.capitalInfo.latlng)
        .then(newWeather => {setWeather(newWeather)})
    }
    else
    {
      setWeather(null)
    }
  },[selected])

  const filteredCountries = countries ? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase())) : null

  if (filteredCountries && filteredCountries.length === 1 && !selected){
    setSelected(filteredCountries[0])
  }

  console.log(filteredCountries)

  const updateFilter = (event) => {
    setFilter(event.target.value)
    setSelected(null)
  }

  const selectCountry = (selected) => {
    setSelected(selected)
  }

  return (
    <div>
      find countries <input type='text' value={filter} onChange={updateFilter}></input>
      <CountryList countries={filteredCountries} selected={selected} selectCountry={selectCountry}/>
      <Details country={selected}/>
      <Weather weather={weather}/>
    </div>
  )
}

export default App