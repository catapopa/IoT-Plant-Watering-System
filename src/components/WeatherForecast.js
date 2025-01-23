import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { fetchWeatherData, prepareChartData } from "../api/weather";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import config from "../config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LOCATION_KEY = 287713;

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch weather data for current day and 5-day forecast
    fetchWeatherData(LOCATION_KEY, config.API_KEY)
      .then((data) => setWeatherData(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>{error}</div>;

  if (!weatherData) {
    return <CircularProgress />;
  }

  // Prepare data for the forecast chart
  const chartData = prepareChartData(weatherData.DailyForecasts);

  return (
    <Box p={2}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#4B456A",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing={3}>
          {/* Current Weather Display */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{ maxWidth: 345, backgroundColor: "#ffffff", boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Current Weather
                </Typography>
                {weatherData.DailyForecasts[0] ? (
                  <>
                    <Typography variant="h4" color="#F36C45">
                      {weatherData.DailyForecasts[0].Temperature.Maximum.Value}{" "}
                      °C
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {weatherData.DailyForecasts[0].Day.IconPhrase}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Precipitation:{" "}
                      {weatherData.DailyForecasts[0].Day.HasPrecipitation
                        ? "Yes"
                        : "No"}
                    </Typography>
                  </>
                ) : (
                  <CircularProgress />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Weather Forecast Display */}
          <Grid item xs={12} sm={6} md={8}>
            <Card
              sx={{ maxWidth: 800, backgroundColor: "#ffffff", boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  5-Day Weather Forecast
                </Typography>
                {weatherData.DailyForecasts.length > 0 ? (
                  <>
                    <Line data={chartData} options={{ responsive: true }} />
                    <Grid container spacing={2} mt={2}>
                      {weatherData.DailyForecasts.map((forecast, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card
                            sx={{
                              backgroundColor: "#E9E8F0",
                              padding: "15px",
                              borderRadius: 5,
                            }}
                          >
                            <Typography variant="h6" color="#1E1645">
                              {new Date(forecast.Date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" color="#F36C45">
                              Max Temp: {forecast.Temperature.Maximum.Value} °C
                            </Typography>
                            <Typography variant="body1" color="#F69174">
                              Min Temp: {forecast.Temperature.Minimum.Value} °C
                            </Typography>
                            <Typography variant="body1" color="#1E1645">
                              {forecast.Day.IconPhrase}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <CircularProgress />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default WeatherForecast;
