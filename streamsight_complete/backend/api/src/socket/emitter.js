const mongoose = require("mongoose");

function startChangeStreamEmitter(io) {
  const db = mongoose.connection.db;

  // Watch aggregated_metrics
  const metricStream = db
    .collection("aggregated_metrics")
    .watch([], { fullDocument: "updateLookup" });
  metricStream.on("change", (change) => {
    if (change.operationType === "insert") {
      io.emit("metrics:update", change.fullDocument);
    }
  });
  metricStream.on("error", (err) =>
    console.error("[ChangeStream:metrics]", err.message),
  );

  // Watch anomalies
  const anomalyStream = db
    .collection("anomalies")
    .watch([], { fullDocument: "updateLookup" });
  anomalyStream.on("change", (change) => {
    if (change.operationType === "insert") {
      io.emit("anomaly:new", change.fullDocument);
    }
  });
  anomalyStream.on("error", (err) =>
    console.error("[ChangeStream:anomalies]", err.message),
  );

  // Watch raw_events
  const eventStream = db
    .collection("raw_events")
    .watch([], { fullDocument: "updateLookup" });
  eventStream.on("change", (change) => {
    if (change.operationType === "insert") {
      io.emit("event:new", change.fullDocument);
    }
  });
  eventStream.on("error", (err) =>
    console.error("[ChangeStream:events]", err.message),
  );

  console.log("[Socket] MongoDB Change Streams active.");
}

module.exports = { startChangeStreamEmitter };
