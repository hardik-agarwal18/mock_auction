import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { PORT } from "./config/env.js";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
