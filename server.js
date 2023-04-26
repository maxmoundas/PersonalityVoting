// import the required libraries
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Create an Express app, HTTP server, and attach the Socket.IO server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up a basic route to test the server
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Listen for incoming connections on a specific port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set up a connection event to handle new clients
io.on("connection", (socket) => {
  console.log("New client connected");

  // Implement your game logic here
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

  

