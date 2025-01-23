import React from "react";
import SensorDataDisplay from "./components/SensorDataDisplay";
import WeatherForecast from "./components/WeatherForecast";
import MotorControl from "./components/MotorControl";

const App = () => {
  return (
    <div>
      <SensorDataDisplay />
      <hr style={{ margin: "20px 0" }} />
      <WeatherForecast />
      <hr style={{ margin: "20px 0" }} />
      <MotorControl />
    </div>
  );
};

export default App;
