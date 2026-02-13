import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { PORT } from "./config/env.js";
import { recoverLiveAuctions } from "./modules/auction/recovery.engine.js";

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

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await recoverLiveAuctions();
});
