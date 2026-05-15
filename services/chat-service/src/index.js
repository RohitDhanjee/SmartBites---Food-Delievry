const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.json({
    service: 'Chat Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ---- AI Smart Reply Logic ----
const getSmartReply = (message) => {
  const text = message.toLowerCase();
  
  const rules = [
    {
      keywords: ['status', 'kahan', 'where', 'location', 'pohnch'],
      replies: [
        "Ji sir, main bas 2 minute mein pohanch raha hoon.",
        "Main aapki location ke bohot kareeb hoon, bas signal par ruka hoon.",
        "Ji, maine restaurant se khana pick kar liya hai aur raste mein hoon."
      ]
    },
    {
      keywords: ['late', 'delay', 'der', 'slow', 'time'],
      replies: [
        "Maazrat sir, raste mein thora traffic block hai, par main jaldi koshish kar raha hoon.",
        "Barish/Traffic ki wajah se thori der ho rahi hai, bas 5-10 minute mazeed lagenge.",
        "Rasta thora kharab hai, main shortcut le raha hoon."
      ]
    },
    {
      keywords: ['hot', 'garam', 'fresh', 'quality'],
      replies: [
        "Ji sir, khana bilkul garam aur packed hai. Main tezi se aa raha hoon.",
        "Zaroor sir, maine check kar liya hai, khana bilkul fresh hai."
      ]
    },
    {
      keywords: ['thanks', 'shukriya', 'ok', 'okay', 'jazakallah'],
      replies: [
        "Bohot shukriya! Bas pohanch gaya.",
        "You're welcome sir! Have a nice meal.",
        "Ji sir, Allah hafiz."
      ]
    },
    {
      keywords: ['hello', 'hi', 'salam', 'hey', 'aoa'],
      replies: [
        "Walaikum Assalam/Hello sir! Main aapka rider baat kar raha hoon. Bas raste mein hoon.",
        "Ji sir, main aapka order le kar nikal chuka hoon."
      ]
    }
  ];

  // Find matching rule
  const matchedRule = rules.find(rule => 
    rule.keywords.some(keyword => text.includes(keyword))
  );

  if (matchedRule) {
    return matchedRule.replies[Math.floor(Math.random() * matchedRule.replies.length)];
  }

  // Fallback for unknown messages
  return "Ji sir, main aapki baat samajh gaya. Main dhyan rakhunga.";
};

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

    // Smart Auto-reply logic if sender is customer
    if (sender === 'customer') {
      setTimeout(() => {
        const smartReply = getSmartReply(text);
        io.to(`order_${orderId}`).emit('receive_message', {
          text: smartReply,
          sender: 'rider',
          timestamp: new Date()
        });
      }, 2500); 
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
