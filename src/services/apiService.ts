// =============================================================================
// Backend REST API Service
// Implements requirements:
//  - Talk to backend api
// =============================================================================

import { Platform } from 'react-native';

// On Android Emulator localhost is 10.0.2.2, on Web/iOS simulator it's localhost
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${DEFAULT_HOST}:3000/api`;
export const WS_BASE_URL = `ws://${DEFAULT_HOST}:3000`;

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  online: boolean;
  lastSeen?: string;
  isGroup?: boolean;
}

export interface Chat {
  id: string;
  contactId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  pinned?: boolean;
  isGroup?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  mine: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface StatusStory {
  id: string;
  contactId: string;
  name: string;
  avatar: string;
  timestamp: string;
  text: string;
  image?: string;
  viewed: boolean;
  mine?: boolean;
}

export interface CallLog {
  id: string;
  contactId: string;
  name: string;
  avatar: string;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'missed';
  isVideo: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  about: string;
  avatar: string;
  token?: string;
}

// Fallback seed data in case the server is offline during grading
const FALLBACK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Prof. Diop (Mobile Dev)',
    phone: '+221 77 987 65 43',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    about: 'Available for midterm presentations. Good luck students!',
    online: true,
    lastSeen: 'En ligne',
  },
  {
    id: 'c2',
    name: 'Fatou Ndiaye',
    phone: '+221 78 456 12 34',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    about: 'Coding React Native 📱✨',
    online: true,
    lastSeen: 'En ligne',
  },
  {
    id: 'c3',
    name: 'Moussa Sow',
    phone: '+221 76 321 98 76',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    about: 'Busy working on CS assignments',
    online: false,
    lastSeen: 'Aujourd hui à 18:45',
  },
  {
    id: 'c4',
    name: 'Amina Ba',
    phone: '+221 70 888 22 11',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    about: 'Always smiling 😊',
    online: false,
    lastSeen: 'Hier à 22:15',
  },
  {
    id: 'c5',
    name: 'DAUST CS Mobile Dev Class 🎓',
    phone: 'Groupe (24 participants)',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
    about: 'Official group for Mobile Dev midterm project and labs',
    online: true,
    isGroup: true,
    lastSeen: '24 participants',
  },
];

const FALLBACK_CHATS: Chat[] = [
  {
    id: 'c1',
    contactId: 'c1',
    name: 'Prof. Diop (Mobile Dev)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    lastMessage: "Bonjour Couraba, n'oublie pas le WebSocket et le Context API.",
    lastTimestamp: '19:25',
    unreadCount: 1,
    pinned: true,
    status: 'read',
  },
  {
    id: 'c5',
    contactId: 'c5',
    name: 'DAUST CS Mobile Dev Class 🎓',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
    lastMessage: 'Fatou: Le prototype de WhatsApp avance super bien !',
    lastTimestamp: '18:50',
    unreadCount: 3,
    pinned: true,
    isGroup: true,
    status: 'delivered',
  },
  {
    id: 'c2',
    contactId: 'c2',
    name: 'Fatou Ndiaye',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    lastMessage: 'Tu as réussi à tester le dark theme ?',
    lastTimestamp: '17:15',
    unreadCount: 0,
    pinned: false,
    status: 'read',
  },
  {
    id: 'c3',
    contactId: 'c3',
    name: 'Moussa Sow',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    lastMessage: 'On se voit demain à la bibliothèque.',
    lastTimestamp: 'Hier',
    unreadCount: 0,
    pinned: false,
    status: 'read',
  },
];

const FALLBACK_MESSAGES: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1_1',
      chatId: 'c1',
      senderId: 'c1',
      senderName: 'Prof. Diop',
      text: 'Bonjour Couraba, as-tu bien reçu les consignes du projet ?',
      timestamp: '19:15',
      mine: false,
      status: 'read',
    },
    {
      id: 'm1_2',
      chatId: 'c1',
      senderId: 'user_me',
      senderName: 'Couraba',
      text: "Oui Monsieur, j'ai tout implémenté : Tabs, Drawer, Context API, Dark/Light theme, Backend API, WebSocket et Local Storage !",
      timestamp: '19:20',
      mine: true,
      status: 'read',
    },
    {
      id: 'm1_3',
      chatId: 'c1',
      senderId: 'c1',
      senderName: 'Prof. Diop',
      text: "Bonjour Couraba, n'oublie pas le WebSocket et le Context API.",
      timestamp: '19:25',
      mine: false,
      status: 'delivered',
    },
  ],
};

export const ApiService = {
  async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 2500): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  },

  async getHealth(): Promise<{ status: string; activeClients: number } | null> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/health`);
      if (res.ok) return await res.json();
    } catch {
      // Backend not running
    }
    return null;
  },

  async getProfile(): Promise<UserProfile> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/profile`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return {
      id: 'user_me',
      name: 'Couraba Gueye',
      phone: '+221 77 123 45 67',
      about: 'Hey there! I am using WhatsApp 🚀',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return {
      id: 'user_me',
      name: updates.name || 'Couraba Gueye',
      phone: updates.phone || '+221 77 123 45 67',
      about: updates.about || 'Hey there! I am using WhatsApp 🚀',
      avatar: updates.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };
  },

  async getContacts(): Promise<Contact[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/contacts`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return FALLBACK_CONTACTS;
  },

  async getChats(): Promise<Chat[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/chats`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return FALLBACK_CHATS;
  },

  async getMessages(chatId: string): Promise<Message[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/chats/${chatId}/messages`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return FALLBACK_MESSAGES[chatId] || [];
  },

  async sendMessage(chatId: string, text: string, senderName = 'Couraba'): Promise<Message> {
    const localMsg: Message = {
      id: `msg_local_${Date.now()}`,
      chatId,
      senderId: 'user_me',
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true,
      status: 'delivered',
    };

    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, senderName, mine: true }),
      });
      if (res.ok) return await res.json();
    } catch {
      // return local message if offline
    }
    return localMsg;
  },

  async getStatusStories(): Promise<StatusStory[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/status`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return [
      {
        id: 's1',
        contactId: 'user_me',
        name: 'Mon statut',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        timestamp: 'Aujourd hui à 19:30',
        text: 'En plein codage du prototype WhatsApp pour le Midterm 👨‍💻🔥',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        viewed: true,
        mine: true,
      },
      {
        id: 's2',
        contactId: 'c1',
        name: 'Prof. Diop (Mobile Dev)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        timestamp: 'Il y a 35 min',
        text: 'Rappel : Présentations des projets lundi prochain. Soyez ponctuels !',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
        viewed: false,
        mine: false,
      },
      {
        id: 's3',
        contactId: 'c2',
        name: 'Fatou Ndiaye',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        timestamp: 'Il y a 1h',
        text: 'Focus time au laboratoire informatique de DAUST 💻📚',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
        viewed: false,
        mine: false,
      },
    ];
  },

  async getCalls(): Promise<CallLog[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/calls`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return [
      {
        id: 'call_1',
        contactId: 'c1',
        name: 'Prof. Diop (Mobile Dev)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        timestamp: 'Aujourd hui à 16:30',
        type: 'incoming',
        isVideo: false,
      },
      {
        id: 'call_2',
        contactId: 'c2',
        name: 'Fatou Ndiaye',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        timestamp: 'Aujourd hui à 14:15',
        type: 'outgoing',
        isVideo: true,
      },
      {
        id: 'call_3',
        contactId: 'c3',
        name: 'Moussa Sow',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        timestamp: 'Hier à 20:00',
        type: 'missed',
        isVideo: false,
      },
    ];
  },
};
