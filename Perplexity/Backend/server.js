import dns from "node:dns";

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

import connectDB from './config/database.js'
import app from './src/app.js'
import http, { createServer } from 'http'
import { initSocket } from './socket/socket.server.js'


await connectDB()
    .catch((err)=> {
      console.log("Connection failed with mongoDB", err);
      process.exit(1)
    })


const httpServer = http.createServer(app);

initSocket(httpServer);


const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

