import React, { useState } from "react";
import { publishMotorCommand } from "../../api/sensor";
import {
  containerStyle,
  headingStyle,
  startButtonStyle,
  stopButtonStyle,
} from "./styles";

const MotorControl = () => {
  const [status, setStatus] = useState("");
  const [isMotorRunning, setIsMotorRunning] = useState(false);

  const handleMotorCommand = async (command) => {
    setStatus("Sending command...");
    try {
      const response = await publishMotorCommand(command);
      setStatus(response);

      if (command === "start_motor") {
        setIsMotorRunning(true); // Set motor status to running
      } else if (command === "stop_motor") {
        setIsMotorRunning(false); // Set motor status to stopped
      }
    } catch (error) {
      setStatus("Failed to send command");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Motor Control:</h1>
      {!isMotorRunning ? (
        <button
          onClick={() => handleMotorCommand("start_motor")}
          style={startButtonStyle}
        >
          Start Motor
        </button>
      ) : (
        <button
          onClick={() => handleMotorCommand("stop_motor")}
          style={stopButtonStyle}
        >
          Stop Motor
        </button>
      )}
      {status && <p>{status}</p>}
    </div>
  );
};

export default MotorControl;
