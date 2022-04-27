import mqtt from 'mqtt';

let client: mqtt.Client;

export function mqttInit(): void {
  client = mqtt.connect('mqtt://test.mosquitto.org');

  client.on('connect', () => {
    client.subscribe('MedCabPresenceRRC', console.error);
    client.subscribe('MedCabCommandsRRC', console.error);

    mqttPublish('MedCabPresenceRRC', 'MQTT Connected');
  });

  client.on('message', processMqtt);
}

export function mqttPublish(topic: string, payload: string): Promise<void> {
  return new Promise((resolve, reject) => {
    client.publish(topic, payload, error => {
      if (error) reject(error);
      resolve();
    });
  });
}

export async function processMqtt(topic: string, payload: Buffer): Promise<void> {
  console.log({ topic, payload: payload.toString() });
}
