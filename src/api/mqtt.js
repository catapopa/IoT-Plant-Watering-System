import mqtt from "mqtt";

const brokerUrl = "wss://broker.hivemq.com:8000/mqtt"; // WebSocket MQTT broker
const motorTopic = "home/raspberrypi/motor";

export const publishMotorCommand = (command) => {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.publish(motorTopic, command, (err) => {
        client.end();
        if (err) {
          console.error("Failed to publish command:", err);
          reject(err);
        } else {
          console.log("Motor command published:", command);
          resolve("Command sent successfully");
        }
      });
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      reject(err);
    });
  });
};
