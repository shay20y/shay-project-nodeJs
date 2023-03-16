const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "express index Is Working. " });
})

module.exports = router;