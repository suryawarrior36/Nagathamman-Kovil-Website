import React, { useState, useEffect } from 'react';
import './WeatherApp.css'; // Internal CSS file for styling

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [units, setUnits] = useState('metric'); // Default to Celsius

  const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key

  useEffect(() => {
    if (city) {
      getWeather();
    }
  }, [city, units]);

  const getWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
      );
      const data = await response.json();
      setWeatherData(data);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`
      );
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const displayCurrentWeather = () => {
    if (!weatherData) return null;

    return (
      <div id="current-weather">
        <h3>
          {weatherData.name}, {weatherData.sys.country}
        </h3>
        <p>
          Temperature: {weatherData.main.temp} °{units === 'metric' ? 'C' : 'F'}
        </p>
        <p>
          Min/Max Temperature: {weatherData.main.temp_min} / {weatherData.main.temp_max} °
          {units === 'metric' ? 'C' : 'F'}
        </p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>
          Wind: {weatherData.wind.speed} m/s, {weatherData.wind.deg}°
        </p>
        <p>Description: {weatherData.weather[0].description}</p>
        <img
          src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
          alt="Weather Icon"
        />
      </div>
    );
  };

  const displayForecast = () => {
    if (!forecastData) return null;

    return (
      <div id="forecast">
        <h2>5-Day Forecast</h2>
        {forecastData.list
          .filter((item, index) => index % 8 === 0) // Display every 8th entry for a 5-day forecast
          .map((forecast) => {
            const date = new Date(forecast.dt * 1000);
            const dateString = date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div key={forecast.dt}>
                <p>{dateString}</p>
                <p>
                  Avg Temp: {forecast.main.temp} °{units === 'metric' ? 'C' : 'F'}
                </p>
                <p>Description: {forecast.weather[0].description}</p>
                <img
                  src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              </div>
            );
          })}
      </div>
    );
  };

  const toggleUnit = () => {
    setUnits((prevUnits) => (prevUnits === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div id="weather-container">
      <h1>Weather Forecast</h1>
      <input
        type="text"
        id="city-input"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {displayCurrentWeather()}
      {displayForecast()}

      <div id="toggle-unit" onClick={toggleUnit}>
        Toggle Unit (C/F)
      </div>
    </div>
  );
};

export default WeatherApp;
