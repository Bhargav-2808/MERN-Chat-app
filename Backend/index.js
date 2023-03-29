import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import db from "./db/db.js";
import { Server } from "socket.io";
import { errorHandler, notFound } from "./middleware/error.js";

dotenv.config();
const app = express();
let port = process.env.PORT || 5000;

app.use(cors());
// app.use((req, res, next) =>{
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(express.json());
db;

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);
// app.use(notFound);
// app.use(errorHandler);
const httpServer = app.listen(port, () => {
  console.log(`App is running on the Port ${port}`);
});

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    credentials: true,
  },
});

// app.get("videocaall/:room", (req, res) => {
//   res.render("home",{layout:'index',roomID:req.params.room});
// });
// localhost
// io.on("connection", (socket) => {
//   socket.on("join-room", (roomId, userId) => {
//       socket.join(roomId);
//       socket.broadcast.to(roomId).emit("user-connected", userId);
//   });
// });

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  },

  
  
  );

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // socket.on("group created", (room) => socket.in(room).emit("group created"));
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log(emailId, roomId);

    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", {
      roomId,
    });
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const socketId = emailToSocketMapping.get(emailId);
    const fromEmail = socketToEmailMapping.get(socket.id);
    socket.to(socketId).emit("incoming-call", {
      from: fromEmail,
      offer,
    });
  });

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId);

    socket.to(socketId).emit("call-accepted", { ans });
  });
});
