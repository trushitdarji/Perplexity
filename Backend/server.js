import "dotenv/config";
import app from "./src/app.js";
import ConnectDB from "./src/config/database.js";
import http from "http"
import { initSocket } from "./src/sockets/server.sockets.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app)

initSocket(httpServer)

ConnectDB();


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
