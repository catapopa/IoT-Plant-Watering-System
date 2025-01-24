import React from "react";
import SensorDataDisplay from "./components/SensorDataDisplay/SensorDataDisplay";
import WeatherForecast from "./components/WeatherForecast/WeatherForecast";
import MotorControl from "./components/MotorControl/MotorControl";

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
