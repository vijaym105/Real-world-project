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


httpServer.listen(3000, () => {
  console.log('server is running on port 3000')
})

