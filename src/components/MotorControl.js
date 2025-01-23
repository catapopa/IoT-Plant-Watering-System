import React, { useState } from "react";
import { publishMotorCommand } from "../api/mqtt";

const MotorControl = () => {
  const [status, setStatus] = useState("");

  const handleMotorStart = async () => {
    setStatus("Sending command...");
    try {
      const response = await publishMotorCommand("start_motor");
      setStatus(response);
    } catch (error) {
      setStatus("Failed to send command");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Motor Control</h1>
      <button
        onClick={handleMotorStart}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Start Motor
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default MotorControl;
