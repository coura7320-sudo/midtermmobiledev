// =============================================================================
// Chat Context (Conversations, Real-time WebSocket Messaging, Local Persistence)
// Implements requirements:
//  - use Context api
//  - WebSocket communication
//  - Talk to backend api
//  - Store data locally (sqlite / key-value store)
//  - use appropriate other hooks (useCallback, useMemo, useRef, useEffect)
// =============================================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  ApiService,
  Chat,
  Contact,
  Message,
  StatusStory,
  CallLog,
} from '@/services/apiService';
import { socketService } from '@/services/socketService';
import { KeyValueStore, SQLiteStore } from '@/services/storageService';
import { useAuth } from './AuthContext';

export type ChatFilter = 'all' | 'unread' | 'favorites' | 'groups';

interface ChatContextType {
  chats: Chat[];
  contacts: Contact[];
  messages: Record<string, Message[]>;
  statusStories: StatusStory[];
  calls: CallLog[];
  isSocketConnected: boolean;
  typingMap: Record<string, string>; // chatId -> senderName
  searchQuery: string;
  activeFilter: ChatFilter;
  filteredChats: Chat[];
  totalUnreadCount: number;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: ChatFilter) => void;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  markChatAsRead: (chatId: string) => void;
  sendTypingStatus: (chatId: string, isTyping: boolean) => void;
  startNewChat: (contact: Contact) => string;
  addStatusStory: (text: string, image?: string) => Promise<void>;
  logCall: (contactId: string, isVideo: boolean) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  chats: [],
  contacts: [],
  messages: {},
  statusStories: [],
  calls: [],
  isSocketConnected: false,
  typingMap: {},
  searchQuery: '',
  activeFilter: 'all',
  filteredChats: [],
  totalUnreadCount: 0,
  setSearchQuery: () => {},
  setActiveFilter: () => {},
  sendMessage: async () => {},
  markChatAsRead: () => {},
  sendTypingStatus: () => {},
  startNewChat: () => '',
  addStatusStory: async () => {},
  logCall: async () => {},
  refreshAll: async () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [statusStories, setStatusStories] = useState<StatusStory[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [typingMap, setTypingMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all');

  // Ref to hold current state inside socket callbacks without stale closures
  const chatsRef = useRef<Chat[]>(chats);
  chatsRef.current = chats;
  const messagesRef = useRef<Record<string, Message[]>>(messages);
  messagesRef.current = messages;

  // ---------------------------------------------------------------------------
  // 1. Initial Data Loading & Local Cache Sync
  // ---------------------------------------------------------------------------
  const loadInitialData = useCallback(async () => {
    try {
      // 1. First, retrieve cached data from local KeyValueStore for instant load
      const [cachedChats, cachedContacts, cachedMessages, cachedStatus, cachedCalls] =
        await Promise.all([
          KeyValueStore.getItem<Chat[]>('chats_list'),
          KeyValueStore.getItem<Contact[]>('contacts_list'),
          KeyValueStore.getItem<Record<string, Message[]>>('all_messages'),
          KeyValueStore.getItem<StatusStory[]>('status_stories'),
          KeyValueStore.getItem<CallLog[]>('calls_log'),
        ]);

      if (cachedChats) setChats(cachedChats);
      if (cachedContacts) setContacts(cachedContacts);
      if (cachedMessages) setMessages(cachedMessages);
      if (cachedStatus) setStatusStories(cachedStatus);
      if (cachedCalls) setCalls(cachedCalls);

      // 2. Fetch fresh data from backend REST API
      const [remoteChats, remoteContacts, remoteStatus, remoteCalls] = await Promise.all([
        ApiService.getChats(),
        ApiService.getContacts(),
        ApiService.getStatusStories(),
        ApiService.getCalls(),
      ]);

      if (remoteChats) {
        setChats(remoteChats);
        await KeyValueStore.setItem('chats_list', remoteChats);
      }
      if (remoteContacts) {
        setContacts(remoteContacts);
        await KeyValueStore.setItem('contacts_list', remoteContacts);
      }
      if (remoteStatus) {
        setStatusStories(remoteStatus);
        await KeyValueStore.setItem('status_stories', remoteStatus);
      }
      if (remoteCalls) {
        setCalls(remoteCalls);
        await KeyValueStore.setItem('calls_log', remoteCalls);
      }

      // Preload messages for available chats
      if (remoteChats) {
        const msgsMap: Record<string, Message[]> = { ...cachedMessages };
        for (const chat of remoteChats) {
          const msgs = await ApiService.getMessages(chat.id);
          if (msgs && msgs.length > 0) {
            msgsMap[chat.id] = msgs;
          }
        }
        setMessages(msgsMap);
        await KeyValueStore.setItem('all_messages', msgsMap);
      }
    } catch (err) {
      console.warn('[ChatContext] Initial load warning:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ---------------------------------------------------------------------------
  // 2. WebSocket Real-time Integration
  // ---------------------------------------------------------------------------
  useEffect(() => {
    socketService.connect();

    const unsubConn = socketService.on('connection:change', (data: { connected: boolean }) => {
      setIsSocketConnected(data.connected);
    });

    // Handle new incoming messages via WebSocket
    const unsubMsg = socketService.on('message:new', (data: { chatId: string; message: Message }) => {
      const { chatId, message } = data;
      setMessages((prev) => {
        const currentList = prev[chatId] || [];
        // Avoid duplicate
        if (currentList.some((m) => m.id === message.id)) return prev;
        const updated = { ...prev, [chatId]: [...currentList, message] };
        KeyValueStore.setItem('all_messages', updated);
        return updated;
      });

      // Update chats list
      setChats((prev) => {
        const index = prev.findIndex((c) => c.id === chatId);
        if (index !== -1) {
          const updatedChat: Chat = {
            ...prev[index],
            lastMessage: message.text,
            lastTimestamp: message.timestamp,
            status: message.status,
            unreadCount: message.mine ? prev[index].unreadCount : prev[index].unreadCount + 1,
          };
          const next = [...prev];
          next.splice(index, 1);
          next.unshift(updatedChat);
          KeyValueStore.setItem('chats_list', next);
          return next;
        }
        return prev;
      });
    });

    // Handle message ACK from server
    const unsubAck = socketService.on('message:ack', (data: { tempId: string; message: Message }) => {
      const { tempId, message } = data;
      setMessages((prev) => {
        const chatMsgs = prev[message.chatId] || [];
        const nextList = chatMsgs.map((m) => (m.id === tempId ? message : m));
        const updated = { ...prev, [message.chatId]: nextList };
        KeyValueStore.setItem('all_messages', updated);
        return updated;
      });
    });

    // Handle read receipts
    const unsubRead = socketService.on('message:read', (data: { chatId: string }) => {
      const { chatId } = data;
      setMessages((prev) => {
        const chatMsgs = prev[chatId] || [];
        const nextList = chatMsgs.map((m) => (m.mine ? { ...m, status: 'read' as const } : m));
        return { ...prev, [chatId]: nextList };
      });
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0, status: 'read' } : c))
      );
    });

    // Handle Typing indicators
    const unsubTypingStart = socketService.on(
      'typing:start',
      (data: { chatId: string; senderName?: string }) => {
        setTypingMap((prev) => ({ ...prev, [data.chatId]: data.senderName || 'En train d\'écrire...' }));
      }
    );

    const unsubTypingStop = socketService.on('typing:stop', (data: { chatId: string }) => {
      setTypingMap((prev) => {
        const copy = { ...prev };
        delete copy[data.chatId];
        return copy;
      });
    });

    // Handle new Status Story
    const unsubStatus = socketService.on('status:new', (data: { status: StatusStory }) => {
      setStatusStories((prev) => {
        const next = [data.status, ...prev];
        KeyValueStore.setItem('status_stories', next);
        return next;
      });
    });

    return () => {
      unsubConn();
      unsubMsg();
      unsubAck();
      unsubRead();
      unsubTypingStart();
      unsubTypingStop();
      unsubStatus();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 3. User Actions (SendMessage, MarkRead, Typing, Status, Calls)
  // ---------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (chatId: string, text: string) => {
      if (!text.trim()) return;

      const tempId = `temp_${Date.now()}`;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const optimisticMsg: Message = {
        id: tempId,
        chatId,
        senderId: user.id || 'user_me',
        senderName: user.name || 'Couraba',
        text: text.trim(),
        timestamp: now,
        mine: true,
        status: 'delivered',
      };

      // 1. Optimistic local UI update
      setMessages((prev) => {
        const currentList = prev[chatId] || [];
        const next = { ...prev, [chatId]: [...currentList, optimisticMsg] };
        KeyValueStore.setItem('all_messages', next);
        return next;
      });

      // Update chats item last message
      setChats((prev) => {
        const targetIndex = prev.findIndex((c) => c.id === chatId);
        if (targetIndex !== -1) {
          const updatedChat = {
            ...prev[targetIndex],
            lastMessage: optimisticMsg.text,
            lastTimestamp: optimisticMsg.timestamp,
            status: 'delivered' as const,
          };
          const next = [...prev];
          next.splice(targetIndex, 1);
          next.unshift(updatedChat);
          KeyValueStore.setItem('chats_list', next);
          return next;
        }
        return prev;
      });

      // 2. Dispatch via WebSocket if connected
      const sentViaWs = socketService.sendMessage(chatId, text.trim(), user.name, tempId);

      // 3. REST API Fallback
      if (!sentViaWs) {
        try {
          const confirmed = await ApiService.sendMessage(chatId, text.trim(), user.name);
          setMessages((prev) => {
            const list = prev[chatId] || [];
            const nextList = list.map((m) => (m.id === tempId ? confirmed : m));
            const updated = { ...prev, [chatId]: nextList };
            KeyValueStore.setItem('all_messages', updated);
            return updated;
          });
        } catch (err) {
          console.warn('[ChatContext] Rest send failed:', err);
        }
      }

      // Also log to SQLite store
      SQLiteStore.executeSql('INSERT INTO messages (id, chatId, text, timestamp) VALUES (?, ?, ?, ?)', [
        optimisticMsg,
      ]);
    },
    [user]
  );

  const markChatAsRead = useCallback((chatId: string) => {
    socketService.markAsRead(chatId);

    setChats((prev) => {
      const next = prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0, status: 'read' as const } : c));
      KeyValueStore.setItem('chats_list', next);
      return next;
    });

    setMessages((prev) => {
      const list = prev[chatId] || [];
      const updated = list.map((m) => (m.mine ? { ...m, status: 'read' as const } : m));
      return { ...prev, [chatId]: updated };
    });
  }, []);

  const sendTypingStatus = useCallback((chatId: string, isTyping: boolean) => {
    socketService.sendTyping(chatId, isTyping);
  }, []);

  const startNewChat = useCallback((contact: Contact): string => {
    // Check if chat already exists
    const existing = chatsRef.current.find((c) => c.contactId === contact.id);
    if (existing) {
      return existing.id;
    }

    const newChat: Chat = {
      id: contact.id,
      contactId: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      lastMessage: 'Discussion démarrée',
      lastTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      status: 'read',
    };

    setChats((prev) => {
      const next = [newChat, ...prev];
      KeyValueStore.setItem('chats_list', next);
      return next;
    });

    return newChat.id;
  }, []);

  const addStatusStory = useCallback(
    async (text: string, image?: string) => {
      const newStatus: StatusStory = {
        id: `s_${Date.now()}`,
        contactId: user.id || 'user_me',
        name: 'Mon statut',
        avatar: user.avatar,
        timestamp: 'À l instant',
        text,
        image,
        viewed: true,
        mine: true,
      };

      setStatusStories((prev) => {
        const next = [newStatus, ...prev];
        KeyValueStore.setItem('status_stories', next);
        return next;
      });

      socketService.send('status:new', { status: newStatus });
    },
    [user]
  );

  const logCall = useCallback(
    async (contactId: string, isVideo: boolean) => {
      const contact = contacts.find((c) => c.id === contactId);
      const newCall: CallLog = {
        id: `call_${Date.now()}`,
        contactId,
        name: contact ? contact.name : 'Contact',
        avatar: contact ? contact.avatar : '',
        timestamp: 'À l instant',
        type: 'outgoing',
        isVideo,
      };

      setCalls((prev) => {
        const next = [newCall, ...prev];
        KeyValueStore.setItem('calls_log', next);
        return next;
      });
    },
    [contacts]
  );

  // ---------------------------------------------------------------------------
  // 4. Memoized Filtered Computations
  // ---------------------------------------------------------------------------
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      // 1. Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Active chip filter
      if (activeFilter === 'unread') return chat.unreadCount > 0;
      if (activeFilter === 'favorites') return !!chat.pinned;
      if (activeFilter === 'groups') return !!chat.isGroup;
      return true;
    });
  }, [chats, searchQuery, activeFilter]);

  const totalUnreadCount = useMemo(() => {
    return chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [chats]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        contacts,
        messages,
        statusStories,
        calls,
        isSocketConnected,
        typingMap,
        searchQuery,
        activeFilter,
        filteredChats,
        totalUnreadCount,
        setSearchQuery,
        setActiveFilter,
        sendMessage,
        markChatAsRead,
        sendTypingStatus,
        startNewChat,
        addStatusStory,
        logCall,
        refreshAll: loadInitialData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
