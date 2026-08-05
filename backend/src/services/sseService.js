let clients = [];

function registerClient(res) {
  clients.push(res);
  res.on("close", () => {
    clients = clients.filter(c => c !== res);
  });
}

function broadcast(eventType, data = {}) {
  const payload = JSON.stringify({ type: eventType, data });
  clients.forEach(res => {
    res.write(`data: ${payload}\n\n`);
  });
}

module.exports = { registerClient, broadcast };
