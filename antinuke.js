const logs = {};

function isNuke(userId) {
  const now = Date.now();
  logs[userId] = logs[userId] || [];
  logs[userId].push(now);

  logs[userId] = logs[userId].filter(t => now - t < 5000);

  return logs[userId].length >= 5;
}

module.exports = { isNuke };
