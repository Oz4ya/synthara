import express from "express";
import cors from "cors";
import { client } from "./bot.js";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/api/status", (req, res) => {
  res.json({
    online: client.isReady(),
    ping: client.ws.ping,
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
    uptime: process.uptime(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});