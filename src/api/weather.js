// const API_KEY = "X4o5beg0SOUQ6Qu9R5mM6BXLVEeT61no";
import config from "../config";
const LOCATION_KEY = 287713;
const BASE_URL = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${LOCATION_KEY}`;

export const fetchWeatherForecast = async () => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${config.API_KEY}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    return data.DailyForecasts.slice(0, 3).map((forecast) => ({
      date: forecast.Date,
      temperature: {
        min: forecast.Temperature.Minimum.Value,
        max: forecast.Temperature.Maximum.Value,
      },
      hasPrecipitation: forecast.Day.HasPrecipitation,
      precipitationType: forecast.Day.PrecipitationType || "None",
    }));
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
