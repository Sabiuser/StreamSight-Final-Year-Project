const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  event_id: String,
  user_id: String,
  session_id: String,
  event_type: String,
  page: String,
  product_id: String,
  category: String,
  price: Number,
  timestamp: { type: Date, index: true },
  device: String,
  country: String,
  is_anomalous: Boolean,
});
EventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 3600 });
module.exports = mongoose.model("Event", EventSchema, "raw_events");
