import axios from 'axios'
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/"

const weatherUrl = "https://api.openweathermap.org/data/2.5/weather"

const api_key = import.meta.env.VITE_WEATHER_KEY

const getCountryList = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

const getWeather = (coords) => {
    const request = axios.get(`${weatherUrl}?lat=${coords[0]}&lon=${coords[1]}&appid=${api_key}&units=metric`)
    return request.then(response => response.data)
}

export default { getCountryList, getWeather }