let clients = [];

function registerClient(res) {
  clients.push(res);
  res.on("close", () => {
    clients = clients.filter(c => c !== res);
  });
}

function broadcast(eventType, data = {}) {
  const payload = JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() });
  clients.forEach(res => {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch (err) {
      // ignore broken client connection
    }
  });
}

// Periodic Telemetry Simulator for SSE events
const TELEMETRY_EVENTS = [
  {
    type: "IOT_TEMP_ALERT",
    title: "Cold Room Temperature Spike",
    outlet: "Pune Central Hub",
    message: "Freezer Unit #2 temp increased to -9°C. Automated compressor power boost applied.",
    severity: "warning"
  },
  {
    type: "AUTO_PO_DISPATCH",
    title: "Automated PO Dispatched",
    outlet: "Mumbai Bandra Outlet",
    message: "Mozzarella Cheese inventory dropped below 15kg threshold. PO #PO-8821 sent via WhatsApp Gateway.",
    severity: "info"
  },
  {
    type: "YIELD_PRICING_SURGE",
    title: "Dynamic Yield Surge Active",
    outlet: "Bangalore Indiranagar",
    message: "High lunch demand detected (+34% foot traffic). Special combos adjusted +4% yield margin.",
    severity: "success"
  },
  {
    type: "FRAUD_ANOMALY_FLAG",
    title: "POS Anomaly Flagged",
    outlet: "Delhi Connaught Place",
    message: "Cashier #104 issued 4 consecutive cash voids in 10 mins. Audit log hash generated on Blockchain.",
    severity: "critical"
  }
];

let eventIndex = 0;
const timer = setInterval(() => {
  if (clients.length > 0) {
    const event = TELEMETRY_EVENTS[eventIndex % TELEMETRY_EVENTS.length];
    broadcast(event.type, event);
    eventIndex++;
  }
}, 7000);
if (timer && timer.unref) {
  timer.unref();
}


function getClientCount() {
  return clients.length;
}

module.exports = { registerClient, broadcast, getClientCount };
