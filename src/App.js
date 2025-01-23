import React from "react";
import SensorDataDisplay from "./components/SensorDataDisplay/SensorDataDisplay";
import WeatherForecast from "./components/WeatherForecast";
import MotorControl from "./components/MotorControl";

const App = () => {
  return (
    <div style={{ backgroundColor: "#1E1645" }}>
      <MotorControl />
      <SensorDataDisplay />
      <WeatherForecast />
    </div>
  );
};

export default App;
