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
import { fetchWeatherData, prepareChartData } from "../../api/weather";
import config from "../../config";
import styles from "./styles";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData(config.LOCATION_KEY, config.API_KEY)
      .then((data) => setWeatherData(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>{error}</div>;

  if (!weatherData) {
    return <CircularProgress />;
  }

  const chartData = prepareChartData(weatherData.DailyForecasts);

  return (
    <Box p={2}>
      <Paper elevation={3} sx={styles.container}>
        <Grid container spacing={3}>
          {/* Current Weather Display */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={styles.currentWeatherCard}>
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
            <Card sx={styles.forecastCard}>
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
                          <Card sx={styles.forecastItem}>
                            <Typography
                              variant="h6"
                              sx={styles.forecastItemDate}
                            >
                              {new Date(forecast.Date).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={styles.forecastItemMaxTemp}
                            >
                              Max Temp: {forecast.Temperature.Maximum.Value} °C
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={styles.forecastItemMinTemp}
                            >
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
