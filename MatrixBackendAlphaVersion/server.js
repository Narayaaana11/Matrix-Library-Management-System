require("dotenv").config();
const http = require('http');
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initializeWebSocket } = require("./src/websocket/wsServer");
const bookRoutes = require("./src/routes/bookRoutes");
const rackRoutes = require("./src/routes/racks");
const rackAssignmentRoutes = require("./src/routes/rackAssignments");
const borrowRoutes = require("./src/routes/borrowRoutes");
const activityLogRoutes = require("./src/routes/activityLogRoutes");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocket(server);

// Mount routes
app.use("/api/books", bookRoutes);
app.use("/api/racks", rackRoutes);
app.use("/api/rack-assignments", rackAssignmentRoutes);
app.use("/api/borrow-records", borrowRoutes);
app.use("/api/activity-logs", activityLogRoutes);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`HTTP Server running on port ${PORT}`);
      console.log(`WebSocket Server ready on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  const { wsServer } = require('./src/websocket/wsServer');
  await wsServer.shutdown();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer();
