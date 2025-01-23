import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MQTT_BROKER_URL = "ws://broker.hivemq.com:8000/mqtt"; // WebSocket URL
const SENSOR_TOPIC = "home/raspberrypi/sensor";

const FirstPanel = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [error, setError] = useState(null);
  const [tempData, setTempData] = useState([]);
  const [humData, setHumData] = useState([]);

  // MQTT setup for fetching data
  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(SENSOR_TOPIC, (err) => {
        if (err) setError("Failed to subscribe to topic");
      });
    });

    client.on("message", (topic, message) => {
      if (topic === SENSOR_TOPIC) {
        try {
          const payload = message.toString();
          const [tempPart, humPart] = payload.split(";");

          const tempValue = parseFloat(tempPart.split(": ")[1].split(" ")[0]);
          const humValue = parseFloat(humPart.split(": ")[1].replace("%", ""));

          setTemperature(tempValue);
          setHumidity(humValue);

          // Update chart data with new values
          setTempData((prevData) => [...prevData, tempValue]);
          setHumData((prevData) => [...prevData, humValue]);

          if (tempData.length > 10) {
            setTempData((prevData) => prevData.slice(1)); // Keep last 10 points
            setHumData((prevData) => prevData.slice(1));
          }
        } catch (e) {
          console.error("Error parsing MQTT message:", e);
          setError("Error processing sensor data");
        }
      }
    });

    client.on("error", (err) => setError(`MQTT Error: ${err.message}`));

    return () => client.end(); // Cleanup on unmount
  }, [tempData]);

  const chartData = {
    labels: tempData.map((_, idx) => idx + 1), // Labeling with index (you can change this)
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
