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
      <h1
        style={{
          padding: "10px 20px",
          color: "white",
        }}
      >
        Motor Control:
      </h1>
      <button
        onClick={handleMotorStart}
        style={{
          padding: "10px 20px",
          backgroundColor: "#F36C45",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "20px",
        }}
      >
        Start Motor
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default MotorControl;
