import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_FLASH, GEMINI_MODEL_PRO } from "../constants";
import { Device, Link, TerminalMessage, DeviceType } from "../types";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

// Simulate a CLI command or IoT Code Execution
export const simulateNetworkCommand = async (
  command: string,
  sourceDevice: Device,
  allDevices: Device[],
  links: Link[]
): Promise<string> => {
  const ai = getClient();
  
  // Find connected devices (for IoT logic)
  const connectedLinks = links.filter(l => l.sourceId === sourceDevice.id || l.targetId === sourceDevice.id);
  const connectedDevices = connectedLinks.map(l => {
    const otherId = l.sourceId === sourceDevice.id ? l.targetId : l.sourceId;
    return allDevices.find(d => d.id === otherId);
  }).filter(Boolean);

  const isIoT = [DeviceType.ARDUINO, DeviceType.ESP32].includes(sourceDevice.type as DeviceType);

  // Construct a representation of the state
  const simulationState = {
    device: {
      name: sourceDevice.name,
      type: sourceDevice.type,
      config: sourceDevice.interfaces,
      code: sourceDevice.code,
      sensorValue: sourceDevice.sensorValue, // For sensors
      actuatorState: sourceDevice.actuatorState // For actuators
    },
    connectedPeripherals: connectedDevices?.map(d => ({
      name: d?.name,
      type: d?.type,
      currentValue: d?.sensorValue
    })),
    networkTopology: isIoT ? [] : allDevices.map(d => ({ // Only send full topology for network tasks to save tokens
      id: d.id,
      name: d.name,
      type: d.type,
      interfaces: d.interfaces
    })),
    connections: links
  };

  let prompt = "";

  if (isIoT) {
     prompt = `
      Role: You are an IoT Microcontroller Simulator (Arduino/ESP32).
      Context: The user is running code on "${sourceDevice.name}".
      Connected Components: ${JSON.stringify(simulationState.connectedPeripherals)}
      Device Code: 
      \`\`\`cpp
      ${sourceDevice.code || '// No code uploaded'}
      \`\`\`
      
      Task: Simulate the "Serial Monitor" output for one loop iteration or the specific command "${command}".
      
      Rules:
      1. Interpret the C++/Arduino code logic.
      2. If the code reads a pin connected to a sensor (e.g., Temp Sensor), use the 'currentValue' from Connected Components in your logic.
      3. If the code prints to Serial, output that text.
      4. If the code controls an LED/Motor, output a status message like "[System] LED turned ON".
      5. If the command is "run", simulate the 'loop()'.
      6. Be concise.
    `;
  } else {
    prompt = `
      Role: You are a network terminal simulator.
      Context: User is on "${sourceDevice.name}" (${sourceDevice.type}).
      Network State: ${JSON.stringify(simulationState.networkTopology)}
      Connections: ${JSON.stringify(simulationState.connections)}
      
      Task: Simulate output for command: "${command}".
      
      Rules:
      1. Analyze IPs/Subnets/Links.
      2. For 'ping', check connectivity. Output realistic Linux/Cisco ping results (max 4 lines).
      3. If unreachable, show "Host Unreachable".
      4. Support basic commands: ping, ipconfig, ifconfig, show ip interface brief, traceroute.
      5. No explanations, only terminal output.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: {
        role: 'user',
        parts: [{ text: prompt }]
      },
    });
    return response.text || "No output returned.";
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return "Error: Simulation service unavailable.";
  }
};

// AI Tutor chat
export const getTutorResponse = async (
  messages: TerminalMessage[],
  context?: string
): Promise<string> => {
  const ai = getClient();

  const systemInstruction = `You are a helpful Network & IoT Engineering Tutor. 
  You assist students in "Dan Mudi Virtual Networking & IoT Lab".
  Topics: CCNA Networking, IoT, Arduino/ESP32 coding, Electronics.
  
  LANGUAGE INSTRUCTION: 
  You are strictly required to understand and communicate in multiple languages to help users solve their problems. 
  Specifically, you must be proficient in Hausa and English.
  - If a user asks a question in Hausa, you MUST reply in Hausa.
  - If a user asks in English, reply in English.
  - Adapt to the user's language automatically.

  Keep answers concise and educational.
  ${context ? `Current Lab Context: ${context}` : ''}`;

  // Map 'system' role (used for bot in UI) to 'model' for Gemini API
  const history = messages.map(m => ({
    role: m.role === 'system' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_PRO,
      contents: history,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Tutor Error:", error);
    return "I'm having trouble connecting to the knowledge base right now.";
  }
};