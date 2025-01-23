import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

const MQTT_BROKER_URL = "ws://broker.hivemq.com:8000/mqtt"; // WebSocket URL
const SENSOR_TOPIC = "home/raspberrypi/sensor";

const SensorDataDisplay = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [error, setError] = useState(null);

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
        } catch (e) {
          console.error("Error parsing MQTT message:", e);
          setError("Error processing sensor data");
        }
      }
    });

    client.on("error", (err) => setError(`MQTT Error: ${err.message}`));

    return () => client.end(); // Cleanup on unmount
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Raspberry Pi Sensor Data</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>
          Temperature:{" "}
          {temperature !== null ? `${temperature} °C` : "Loading..."}
        </h2>
        <h2>Humidity: {humidity !== null ? `${humidity} %` : "Loading..."}</h2>
      </div>
    </div>
  );
};

export default SensorDataDisplay;
