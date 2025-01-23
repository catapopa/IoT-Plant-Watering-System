import React, { useState, useEffect } from "react";
import { fetchWeatherForecast } from "../api/weather";

const WeatherForecast = () => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getForecast = async () => {
      try {
        const data = await fetchWeatherForecast();
        setForecast(data);
        setError(null);
      } catch (err) {
        setError("Failed to load weather forecast");
      } finally {
        setLoading(false);
      }
    };

    getForecast();
  }, []);

  if (loading) {
    return <p>Loading weather forecast...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>3-Day Weather Forecast</h1>
      {forecast.map((day, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <h3>{new Date(day.date).toLocaleDateString()}</h3>
          <p>
            <strong>Temperature:</strong> {day.temperature.min}°C -{" "}
            {day.temperature.max}°C
          </p>
          <p>
            <strong>Precipitation:</strong>{" "}
            {day.hasPrecipitation ? day.precipitationType : "None"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default WeatherForecast;
