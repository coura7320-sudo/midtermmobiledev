// =============================================================================
// WhatsApp Prototype Backend - REST API + WebSocket Server
// Course: Mobile Application Development (Midterm Project)
// Author: Couraba Gueye
// =============================================================================

const http = require("http");
const url = require("url");
const WebSocket = require("../node_modules/ws");

const PORT = process.env.PORT || 3000;

// -----------------------------------------------------------------------------
// In-Memory Database / Initial Seed Data
// -----------------------------------------------------------------------------
let currentUser = {
  id: "user_me",
  name: "Couraba Gueye",
  phone: "+221 77 123 45 67",
  about: "Hey there! I am using WhatsApp 🚀",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  token: "jwt_token_couraba_midterm_2026_secured"
};

let contacts = [
  {
    id: "c1",
    name: "Prof. Diop (Mobile Dev)",
    phone: "+221 77 987 65 43",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    about: "Available for midterm presentations. Good luck students!",
    online: true,
    lastSeen: "En ligne",
  },
  {
    id: "c2",
    name: "Fatou Ndiaye",
    phone: "+221 78 456 12 34",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    about: "Coding React Native 📱✨",
    online: true,
    lastSeen: "En ligne",
  },
  {
    id: "c3",
    name: "Moussa Sow",
    phone: "+221 76 321 98 76",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    about: "Busy working on CS assignments",
    online: false,
    lastSeen: "Aujourd'hui à 18:45",
  },
  {
    id: "c4",
    name: "Amina Ba",
    phone: "+221 70 888 22 11",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    about: "Always smiling 😊",
    online: false,
    lastSeen: "Hier à 22:15",
  },
  {
    id: "c5",
    name: "DAUST CS Mobile Dev Class 🎓",
    phone: "Groupe (24 participants)",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80",
    about: "Official group for Mobile Dev midterm project and labs",
    online: true,
    isGroup: true,
    lastSeen: "Moussa est en train d'écrire...",
  },
  {
    id: "c6",
    name: "Awa Diop",
    phone: "+221 77 654 32 10",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    about: "DAUST Campus Life",
    online: true,
    lastSeen: "En ligne",
  }
];

let chats = [
  {
    id: "c1",
    contactId: "c1",
    name: "Prof. Diop (Mobile Dev)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    lastMessage: "Bonjour Couraba, n'oublie pas le WebSocket et le Context API.",
    lastTimestamp: "19:25",
    unreadCount: 1,
    pinned: true,
    status: "read", // 'sent' | 'delivered' | 'read'
  },
  {
    id: "c5",
    contactId: "c5",
    name: "DAUST CS Mobile Dev Class 🎓",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80",
    lastMessage: "Fatou: Le prototype de WhatsApp avance super bien !",
    lastTimestamp: "18:50",
    unreadCount: 3,
    pinned: true,
    isGroup: true,
    status: "delivered",
  },
  {
    id: "c2",
    contactId: "c2",
    name: "Fatou Ndiaye",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    lastMessage: "Tu as réussi à tester le dark theme ?",
    lastTimestamp: "17:15",
    unreadCount: 0,
    pinned: false,
    status: "read",
  },
  {
    id: "c3",
    contactId: "c3",
    name: "Moussa Sow",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    lastMessage: "On se voit demain à la bibliothèque pour réviser.",
    lastTimestamp: "Hier",
    unreadCount: 0,
    pinned: false,
    status: "read",
  },
  {
    id: "c4",
    contactId: "c4",
    name: "Amina Ba",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    lastMessage: "Merci pour les notes de cours !",
    lastTimestamp: "Mercredi",
    unreadCount: 0,
    pinned: false,
    status: "read",
  },
  {
    id: "c6",
    contactId: "c6",
    name: "Awa Diop",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    lastMessage: "À tout à l'heure au labo !",
    lastTimestamp: "03/11/2026",
    unreadCount: 0,
    pinned: false,
    status: "read",
  }
];

let messagesByChat = {
  c1: [
    {
      id: "m1_1",
      chatId: "c1",
      senderId: "c1",
      senderName: "Prof. Diop",
      text: "Bonjour Couraba, as-tu bien reçu les consignes du projet ?",
      timestamp: "19:15",
      mine: false,
      status: "read"
    },
    {
      id: "m1_2",
      chatId: "c1",
      senderId: "user_me",
      senderName: "Couraba",
      text: "Oui Monsieur, j'ai tout implémenté : Tabs, Drawer, Context API, Dark/Light theme, Backend API, WebSocket et Local Storage !",
      timestamp: "19:20",
      mine: true,
      status: "read"
    },
    {
      id: "m1_3",
      chatId: "c1",
      senderId: "c1",
      senderName: "Prof. Diop",
      text: "Bonjour Couraba, n'oublie pas le WebSocket et le Context API.",
      timestamp: "19:25",
      mine: false,
      status: "delivered"
    }
  ],
  c2: [
    {
      id: "m2_1",
      chatId: "c2",
      senderId: "c2",
      senderName: "Fatou",
      text: "Salut Couraba ! Tu as fini le devoir de mobile dev ?",
      timestamp: "17:10",
      mine: false,
      status: "read"
    },
    {
      id: "m2_2",
      chatId: "c2",
      senderId: "user_me",
      senderName: "Couraba",
      text: "Oui, je finalise le design WhatsApp avec les vrais codes couleurs !",
      timestamp: "17:12",
      mine: true,
      status: "read"
    },
    {
      id: "m2_3",
      chatId: "c2",
      senderId: "c2",
      senderName: "Fatou",
      text: "Tu as réussi à tester le dark theme ?",
      timestamp: "17:15",
      mine: false,
      status: "read"
    }
  ],
  c5: [
    {
      id: "m5_1",
      chatId: "c5",
      senderId: "c3",
      senderName: "Moussa",
      text: "Quelqu'un a testé la persistance SQLite et AsyncStorage ?",
      timestamp: "18:40",
      mine: false,
      status: "read"
    },
    {
      id: "m5_2",
      chatId: "c5",
      senderId: "user_me",
      senderName: "Couraba",
      text: "Oui ça marche nickel, les données restent même quand on ferme l'appli.",
      timestamp: "18:45",
      mine: true,
      status: "read"
    },
    {
      id: "m5_3",
      chatId: "c5",
      senderId: "c2",
      senderName: "Fatou",
      text: "Fatou: Le prototype de WhatsApp avance super bien !",
      timestamp: "18:50",
      mine: false,
      status: "delivered"
    }
  ]
};

let statusUpdates = [
  {
    id: "s1",
    contactId: "user_me",
    name: "Mon statut",
    avatar: currentUser.avatar,
    timestamp: "Aujourd'hui à 19:30",
    text: "En plein codage du prototype WhatsApp pour le Midterm 👨‍💻🔥",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    viewed: true,
    mine: true
  },
  {
    id: "s2",
    contactId: "c1",
    name: "Prof. Diop (Mobile Dev)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    timestamp: "Il y a 35 minutes",
    text: "Rappel : Présentations des projets lundi prochain. Soyez ponctuels !",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    viewed: false,
    mine: false
  },
  {
    id: "s3",
    contactId: "c2",
    name: "Fatou Ndiaye",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    timestamp: "Il y a 1 heure",
    text: "Focus time au laboratoire informatique de DAUST 💻📚",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
    viewed: false,
    mine: false
  },
  {
    id: "s4",
    contactId: "c4",
    name: "Amina Ba",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    timestamp: "Il y a 3 heures",
    text: "Pause café méritée ☕✨",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
    viewed: true,
    mine: false
  }
];

let callsList = [
  {
    id: "call_1",
    contactId: "c1",
    name: "Prof. Diop (Mobile Dev)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    timestamp: "Aujourd'hui à 16:30",
    type: "incoming", // 'incoming' | 'outgoing' | 'missed'
    isVideo: false
  },
  {
    id: "call_2",
    contactId: "c2",
    name: "Fatou Ndiaye",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    timestamp: "Aujourd'hui à 14:15",
    type: "outgoing",
    isVideo: true
  },
  {
    id: "call_3",
    contactId: "c3",
    name: "Moussa Sow",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    timestamp: "Hier à 20:00",
    type: "missed",
    isVideo: false
  }
];

// -----------------------------------------------------------------------------
// Helper: Send JSON response
// -----------------------------------------------------------------------------
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(data));
}

// -----------------------------------------------------------------------------
// HTTP Server (REST API)
// -----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    return res.end();
  }

  // Health check
  if (pathname === "/api/health" && method === "GET") {
    return sendJson(res, 200, {
      status: "ok",
      app: "WhatsApp Prototype Backend",
      time: new Date().toISOString(),
      activeClients: wss ? wss.clients.size : 0
    });
  }

  // Profile endpoints
  if (pathname === "/api/profile" && method === "GET") {
    return sendJson(res, 200, currentUser);
  }

  if (pathname === "/api/profile" && method === "PUT") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const updates = JSON.parse(body);
        currentUser = { ...currentUser, ...updates };
        sendJson(res, 200, currentUser);
      } catch (err) {
        sendJson(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  // Contacts endpoint
  if (pathname === "/api/contacts" && method === "GET") {
    return sendJson(res, 200, contacts);
  }

  // Chats list endpoint
  if (pathname === "/api/chats" && method === "GET") {
    return sendJson(res, 200, chats);
  }

  // Specific chat messages: GET /api/chats/:id/messages
  const chatMessagesMatch = pathname.match(/^\/api\/chats\/([a-zA-Z0-9_-]+)\/messages$/);
  if (chatMessagesMatch) {
    const chatId = chatMessagesMatch[1];

    if (method === "GET") {
      const messages = messagesByChat[chatId] || [];
      return sendJson(res, 200, messages);
    }

    if (method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        try {
          const payload = JSON.parse(body);
          const newMsg = {
            id: "msg_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            chatId: chatId,
            senderId: payload.senderId || "user_me",
            senderName: payload.senderName || "Couraba",
            text: payload.text || "",
            timestamp: payload.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mine: payload.mine !== undefined ? payload.mine : true,
            status: "delivered"
          };

          if (!messagesByChat[chatId]) {
            messagesByChat[chatId] = [];
          }
          messagesByChat[chatId].push(newMsg);

          // Update last message in chat list
          const targetChat = chats.find(c => c.id === chatId);
          if (targetChat) {
            targetChat.lastMessage = newMsg.text;
            targetChat.lastTimestamp = newMsg.timestamp;
            targetChat.status = "delivered";
          }

          // Broadcast via WebSocket to connected clients
          broadcast({
            type: "message:new",
            chatId: chatId,
            message: newMsg
          });

          // Trigger simulated reply if talking to contact
          scheduleSimulatedReply(chatId, newMsg.text);

          return sendJson(res, 201, newMsg);
        } catch (err) {
          return sendJson(res, 400, { error: "Invalid JSON body" });
        }
      });
      return;
    }
  }

  // Status updates
  if (pathname === "/api/status" && method === "GET") {
    return sendJson(res, 200, statusUpdates);
  }

  if (pathname === "/api/status" && method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const newStatus = {
          id: "s_" + Date.now(),
          contactId: "user_me",
          name: "Mon statut",
          avatar: currentUser.avatar,
          timestamp: "À l'instant",
          text: payload.text || "",
          image: payload.image || "",
          viewed: true,
          mine: true
        };
        statusUpdates.unshift(newStatus);
        broadcast({ type: "status:new", status: newStatus });
        return sendJson(res, 201, newStatus);
      } catch (e) {
        return sendJson(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  // Calls endpoint
  if (pathname === "/api/calls" && method === "GET") {
    return sendJson(res, 200, callsList);
  }

  if (pathname === "/api/calls" && method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const newCall = {
          id: "call_" + Date.now(),
          contactId: payload.contactId,
          name: payload.name || "Contact",
          avatar: payload.avatar || "",
          timestamp: "À l'instant",
          type: payload.type || "outgoing",
          isVideo: !!payload.isVideo
        };
        callsList.unshift(newCall);
        return sendJson(res, 201, newCall);
      } catch (e) {
        return sendJson(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  // 404 for unknown routes
  sendJson(res, 404, { message: "Route not found", path: pathname });
});

// -----------------------------------------------------------------------------
// WebSocket Real-time Messaging Server
// -----------------------------------------------------------------------------
const wss = new WebSocket.Server({ server });

function broadcast(data, excludeWs = null) {
  const jsonStr = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(jsonStr);
    }
  });
}

// Simulated intelligent replies for realistic live demo with the Professor
function scheduleSimulatedReply(chatId, userMessageText) {
  const contact = contacts.find(c => c.id === chatId);
  if (!contact || contact.isGroup) {
    if (contact && contact.isGroup) {
      // Group reply after 2 seconds
      setTimeout(() => {
        broadcast({ type: "typing:start", chatId: chatId, senderName: "Moussa Sow" });
        setTimeout(() => {
          broadcast({ type: "typing:stop", chatId: chatId });
          const groupMsg = {
            id: "msg_group_" + Date.now(),
            chatId: chatId,
            senderId: "c3",
            senderName: "Moussa Sow",
            text: "Bien joué pour le code ! On valide pour le midterm.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mine: false,
            status: "delivered"
          };
          if (!messagesByChat[chatId]) messagesByChat[chatId] = [];
          messagesByChat[chatId].push(groupMsg);
          const cObj = chats.find(c => c.id === chatId);
          if (cObj) {
            cObj.lastMessage = "Moussa: " + groupMsg.text;
            cObj.lastTimestamp = groupMsg.timestamp;
          }
          broadcast({ type: "message:new", chatId: chatId, message: groupMsg });
        }, 1500);
      }, 800);
    }
    return;
  }

  let replyText = "";
  const lower = (userMessageText || "").toLowerCase();

  if (chatId === "c1") {
    // Prof Diop responses
    if (lower.includes("bonjour") || lower.includes("salut")) {
      replyText = "Bonjour Couraba ! Très beau travail sur l'interface WhatsApp. Le WebSocket fonctionne parfaitement !";
    } else if (lower.includes("midterm") || lower.includes("projet") || lower.includes("note")) {
      replyText = "Excellent travail. Les critères (Tabs, Drawer, Context API, Themes, WebSocket, Storage) sont bien respectés.";
    } else {
      replyText = "C'est bien noté. Votre démonstration en temps réel est très convaincante ! Bravo.";
    }
  } else if (chatId === "c2") {
    // Fatou responses
    if (lower.includes("theme") || lower.includes("dark") || lower.includes("sombre")) {
      replyText = "Oui, le thème sombre WhatsApp (#0b141a) est super fidèle ! J'adore.";
    } else {
      replyText = "Trop fort ! Le WebSocket réagit instantanément.";
    }
  } else {
    replyText = "Message bien reçu sur WhatsApp ! 👍";
  }

  // 1) Emit typing start
  setTimeout(() => {
    broadcast({ type: "typing:start", chatId: chatId, senderName: contact.name });

    // 2) After 1.5s, emit typing stop and send response message
    setTimeout(() => {
      broadcast({ type: "typing:stop", chatId: chatId });
      const replyMsg = {
        id: "msg_reply_" + Date.now(),
        chatId: chatId,
        senderId: contact.id,
        senderName: contact.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: false,
        status: "delivered"
      };

      if (!messagesByChat[chatId]) messagesByChat[chatId] = [];
      messagesByChat[chatId].push(replyMsg);

      const targetChat = chats.find(c => c.id === chatId);
      if (targetChat) {
        targetChat.lastMessage = replyMsg.text;
        targetChat.lastTimestamp = replyMsg.timestamp;
        targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
      }

      broadcast({ type: "message:new", chatId: chatId, message: replyMsg });
    }, 1800);
  }, 700);
}

wss.on("connection", (ws, req) => {
  console.log("[WebSocket] Client connected from", req.socket.remoteAddress);

  // Send welcome ack
  ws.send(JSON.stringify({
    type: "connected",
    message: "Connected to WhatsApp WebSocket Server",
    time: new Date().toISOString()
  }));

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw);
      console.log("[WebSocket] Received event:", data.type);

      switch (data.type) {
        case "message:send": {
          const { chatId, text, senderId, senderName } = data;
          const newMsg = {
            id: "msg_ws_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            chatId: chatId,
            senderId: senderId || "user_me",
            senderName: senderName || currentUser.name,
            text: text || "",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mine: true,
            status: "delivered"
          };

          if (!messagesByChat[chatId]) messagesByChat[chatId] = [];
          messagesByChat[chatId].push(newMsg);

          const cObj = chats.find(c => c.id === chatId);
          if (cObj) {
            cObj.lastMessage = newMsg.text;
            cObj.lastTimestamp = newMsg.timestamp;
            cObj.status = "delivered";
          }

          // Acknowledge back to sender
          ws.send(JSON.stringify({
            type: "message:ack",
            tempId: data.tempId,
            message: newMsg
          }));

          // Broadcast to everyone else
          broadcast({ type: "message:new", chatId: chatId, message: newMsg }, ws);

          // Simulated reply
          scheduleSimulatedReply(chatId, newMsg.text);
          break;
        }

        case "message:read": {
          const { chatId } = data;
          if (messagesByChat[chatId]) {
            messagesByChat[chatId].forEach(m => {
              if (m.mine) m.status = "read";
            });
          }
          const cObj = chats.find(c => c.id === chatId);
          if (cObj) cObj.unreadCount = 0;

          broadcast({ type: "message:read", chatId: chatId });
          break;
        }

        case "typing:start": {
          broadcast({ type: "typing:start", chatId: data.chatId, senderName: currentUser.name }, ws);
          break;
        }

        case "typing:stop": {
          broadcast({ type: "typing:stop", chatId: data.chatId }, ws);
          break;
        }

        case "ping": {
          ws.send(JSON.stringify({ type: "pong", time: Date.now() }));
          break;
        }

        default:
          console.log("[WebSocket] Unknown type:", data.type);
      }
    } catch (err) {
      console.error("[WebSocket] Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("[WebSocket] Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("[WebSocket] Socket error:", err.message);
  });
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------
server.listen(PORT, () => {
  console.log("==================================================================");
  console.log("🟢 WhatsApp Backend is running!");
  console.log(`   - REST API:   http://localhost:${PORT}/api`);
  console.log(`   - WebSocket:  ws://localhost:${PORT}`);
  console.log("   - Health:     http://localhost:${PORT}/api/health");
  console.log("==================================================================");
});
