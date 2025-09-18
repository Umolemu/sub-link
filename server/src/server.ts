import app from "./app";
import { Server } from "socket.io";
import http from "http";

import { connectDB } from "./config/db";

const PORT: number = Number(process.env.PORT) || 3000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Logs for test purposes
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

export { io };

async function startServer() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
