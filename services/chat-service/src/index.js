const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Auto-reply phrases for the Rider
const riderReplies = [
  "Ji sir, main bas 2 minute mein pohanch raha hoon.",
  "Rasta thora block hai, par main jaldi koshish kar raha hoon.",
  "Okay sir, main aapki location ke paas hoon.",
  "Ji, maine restaurant se khana pick kar liya hai.",
  "Zaroor sir, main dhyan rakhunga.",
  "Bohot shukriya! Bas pohanch gaya."
];

io.on('connection', (socket) => {
  console.log('User connected to chat:', socket.id);

  socket.on('join_chat', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`User joined chat room: order_${orderId}`);
  });

  socket.on('send_message', (data) => {
    const { orderId, text, sender } = data;
    
    // Broadcast message to the room
    io.to(`order_${orderId}`).emit('receive_message', {
      text,
      sender,
      timestamp: new Date()
    });

    // Auto-reply logic if sender is customer
    if (sender === 'customer') {
      setTimeout(() => {
        const randomReply = riderReplies[Math.floor(Math.random() * riderReplies.length)];
        io.to(`order_${orderId}`).emit('receive_message', {
          text: randomReply,
          sender: 'rider',
          timestamp: new Date()
        });
      }, 3000); // 3 second delay for realistic feel
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from chat');
  });
});

const PORT = process.env.PORT || 4008;
server.listen(PORT, () => {
  console.log(`💬 Chat Service running on port ${PORT}`);
});
