import { subDays } from "date-fns";
import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import { query, getClient, releaseClient } from "./db.js";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  path: "/socket.io"
  ,
  cors: {
    origin: "*",
    methods: ["GET", "POST","OPTIONS"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});
// const io = new Server(server, { cors: ["http://localhost:4173"] });

io.on("connection", async (socket) => {
  console.log(socket.id + " connected");
  const data = await getData();
  socket.emit("data", data);
  // socket.emit("data", data);

  socket.on("period", async (period) => {
    // console.log(period);
    const data = await getDataFrom(period);
    socket.emit("data", data);
  });

  // Listen for new data in the database
  const client = await getClient();
  const sqlQuery = {
    text: "LISTEN flyaways_insert",
  };
  client.query(sqlQuery);

  client.on("notification", async (notification) => {
    if (notification.channel === "flyaways_insert") {
      const data = await getData();

      socket.emit("data", data);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    client.query({
      text: "UNLISTEN flyaways_insert",
    });
    releaseClient(client);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

async function getData() {
  const start = subDays(new Date(), 7);
  const result = await query(
    "SELECT closed_at,value FROM flyaways WHERE closed_at >= $1 ORDER BY id DESC",
    [start]
  );

  return result.rows;
}

async function getDataFrom(period) {
  let start;
  switch (period) {
    case "1 week":
      start = subDays(new Date(), 7);
      break;
    case "1 month":
      start = new Date();
      start.setMonth(start.getMonth() - 1);
      break;
    case "3 months":
      start = new Date();
      start.setMonth(start.getMonth() - 3);
      break;
    case "6 months":
      start = new Date();
      start.setMonth(start.getMonth() - 6);
      break;
    case "1 year":
      start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      break;

    case "all periods":
      start = new Date();
      start.setFullYear(start.getFullYear() - 10);
      break;

    default:
      throw new Error(`Invalid period: ${period}`);
  }
  const result = await query(
    "SELECT closed_at,value FROM flyaways WHERE closed_at >= $1 ORDER BY id DESC",
    [start]
  );
  console.log(start);

  return result.rows;
}
