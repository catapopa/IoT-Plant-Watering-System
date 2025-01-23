const fetchWeatherData = async (locationKey, apiKey) => {
  try {
    const response = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
};

const prepareChartData = (dailyForecasts) => {
  return {
    labels: dailyForecasts.map((forecast) =>
      new Date(forecast.Date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: dailyForecasts.map(
          (forecast) => forecast.Temperature.Maximum.Value
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };
};

export { fetchWeatherData, prepareChartData };
