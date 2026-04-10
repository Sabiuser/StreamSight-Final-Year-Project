const express = require("express");
const router = express.Router();
const Anomaly = require("../models/Anomaly");

router.get("/", async (req, res) => {
  try {
    const anomalies = await Anomaly.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
