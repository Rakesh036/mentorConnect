// Handle Unhandled Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", { promise, reason });
  process.exit(1);
});

// Load .env in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Imports
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const session = require("express-session");

// Configurations + services
const connectToDatabase = require("./config/mongoConfig");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes/indexRoutes");

// DB Connection
connectToDatabase();

// Models
const User = require("./models/user");

// Express Setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ✅ CORS configuration for Next.js frontend
app.use(
  cors()
);

// ✅ Required: handle preflight correctly
app.options("*", cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Backend Root Route (Next.js handles `/`)
app.use("/", (req, res, next) => {
  // console.log("status: ✅ Backend running at: ",  process.env.NODE_ENV );
  console.log('req received at: ', req.url);
  next();
});

// Routes (API only, no rendering)
app.use(routes);

// Chat enable API (unchanged)
const Booking = require("./models/bookingModel");

app.get("/chat-enabled/:mentorId/:menteeId", async (req, res) => {
  const { mentorId, menteeId } = req.params;

  const now = new Date();
  const booking = await Booking.findOne({
    menteeUserId: menteeId,
    mentorUserId: mentorId,
    status: "confirmed",
    "schedule.start": { $lte: now },
    "schedule.end": { $gte: now },
  });

  res.json({ chatEnabled: !!booking });
});

// 404 fallback (for APIs)
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Error handler middleware
// app.use(errorHandler);

// Socket.io Chat integration
const chatServer = require("./chatServer");
chatServer(io);

// Start Server
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
