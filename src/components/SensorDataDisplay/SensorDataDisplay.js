import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Paper, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
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
import {
  paperStyle,
  cardStyle,
  chartCardStyle,
  typographyTitleStyle,
  typographyPrimaryStyle,
  typographySecondaryStyle,
} from "./styles"; // Import styles
import { fetchSensorData } from "../../api/sensor";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FirstPanel = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [error, setError] = useState(null);
  const [tempData, setTempData] = useState([]);
  const [humData, setHumData] = useState([]);

  const fetchData = async () => {
    try {
      const { temperature, humidity } = await fetchSensorData();

      setTemperature(temperature);
      setHumidity(humidity);

      // Update chart data
      setTempData((prevData) => {
        const updatedData = [...prevData, temperature];
        return updatedData.length > 10 ? updatedData.slice(1) : updatedData; // Keep last 10 points
      });

      setHumData((prevData) => {
        const updatedData = [...prevData, humidity];
        return updatedData.length > 10 ? updatedData.slice(1) : updatedData; // Keep last 10 points
      });
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  // Poll API every 5 seconds
  useEffect(() => {
    fetchData(); // Fetch initial data
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const chartData = {
    labels: tempData.map((_, idx) => idx + 1), // Labeling with index
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Humidity (%)",
        data: humData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={paperStyle}>
        <Grid container spacing={3}>
          {/* Temperature and Humidity Display */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography {...typographyTitleStyle}>
                  Temperature and Humidity
                </Typography>
                <Typography {...typographyPrimaryStyle}>
                  {temperature !== null
                    ? `${temperature.toFixed(1)} °C`
                    : "Loading..."}
                </Typography>
                <Typography {...typographySecondaryStyle}>
                  Humidity:{" "}
                  {humidity !== null
                    ? `${humidity.toFixed(1)} %`
                    : "Loading..."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Chart displaying temperature and humidity over time */}
          <Grid item xs={12} sm={6} md={8}>
            <Card sx={chartCardStyle}>
              <CardContent>
                <Typography {...typographyTitleStyle}>
                  Temperature and Humidity Over Time
                </Typography>
                <Line data={chartData} options={{ responsive: true }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FirstPanel;
