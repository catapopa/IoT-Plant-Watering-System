const API_ENDPOINT = "http://localhost:5000/api/sensor";
const MOTOR_API_ENDPOINT = "http://localhost:5000/api/motor";

// Function to fetch sensor data
export const fetchSensorData = async () => {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch sensor data: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching sensor data:", err);
    throw new Error(`Error fetching sensor data: ${err.message}`);
  }
};

// Function to send a motor command (start/stop)
export const publishMotorCommand = async (command) => {
  if (command !== "start_motor" && command !== "stop_motor") {
    throw new Error(
      "Invalid motor command. Use 'start_motor' or 'stop_motor'."
    );
  }

  const url = `${MOTOR_API_ENDPOINT}/${
    command === "start_motor" ? "start" : "stop"
  }`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to send motor command: ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error sending motor command:", error);
    throw new Error(`Error sending motor command: ${error.message}`);
  }
};
