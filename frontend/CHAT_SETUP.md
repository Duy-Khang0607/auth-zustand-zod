# 📱 Chat Page Setup Guide

## 🎉 Đã hoàn thành

Giao diện Chat Page đã được phát triển hoàn chỉnh với các tính năng:

### ✨ Tính năng chính:
- ✅ Sidebar hiển thị danh sách cuộc trò chuyện
- ✅ Tìm kiếm cuộc trò chuyện
- ✅ Hiển thị tin nhắn theo thời gian thực
- ✅ Gửi tin nhắn (Enter để gửi, Shift+Enter xuống dòng)
- ✅ Avatar người dùng
- ✅ Badge hiển thị số tin nhắn chưa đọc
- ✅ Responsive design
- ✅ UI/UX hiện đại với Shadcn
- ✅ Group messages theo ngày
- ✅ Auto-scroll khi có tin nhắn mới
- ✅ Empty state khi chưa chọn conversation

### 📦 Components đã tạo:

#### UI Components (shadcn):
- `components/ui/avatar.tsx` - Avatar component
- `components/ui/scroll-area.tsx` - Scroll area component
- `components/ui/textarea.tsx` - Textarea component
- `components/ui/badge.tsx` - Badge component

#### Chat Components:
- `components/chat/ChatSidebar.tsx` - Sidebar với danh sách conversations
- `components/chat/ChatHeader.tsx` - Header của chat
- `components/chat/ChatMessages.tsx` - Hiển thị messages
- `components/chat/ChatInput.tsx` - Input để gửi tin nhắn
- `components/chat/EmptyChat.tsx` - Empty state

#### Types:
- `types/chat.ts` - TypeScript types cho chat (Message, Conversation, MessageWithSender)

#### Pages:
- `page/ChatPage.tsx` - Main chat page với mock data

---

## 🚀 Cài đặt Dependencies

Chạy lệnh sau để cài đặt các dependencies cần thiết:

```bash
cd frontend
npm install @radix-ui/react-avatar @radix-ui/react-scroll-area
```

---

## 💡 Mock Data

Hiện tại, ChatPage đang sử dụng **mock data** để demo. Bạn có thể thấy:
- 3 conversations mẫu
- Messages với timestamps khác nhau
- Unread count badges

---

## 🔌 Tích hợp Backend (TODO)

Để kết nối với backend, bạn cần:

### 1. Tạo Chat Services:

```typescript
// src/services/chatServices.ts
import { api } from "@/lib/axios";

export const chatServices = {
  // Get all conversations
  getConversations: async () => {
    const { data } = await api.get('/conversations');
    return data;
  },

  // Get messages by conversation ID
  getMessages: async (conversationId: string) => {
    const { data } = await api.get(`/conversations/${conversationId}/messages`);
    return data;
  },

  // Send message
  sendMessage: async (conversationId: string, content: string) => {
    const { data } = await api.post(`/conversations/${conversationId}/messages`, {
      content
    });
    return data;
  },

  // Mark messages as read
  markAsRead: async (conversationId: string) => {
    const { data } = await api.put(`/conversations/${conversationId}/read`);
    return data;
  },
};
```

### 2. Tạo Chat Store (Zustand):

```typescript
// src/stores/useChatStore.ts
import { create } from "zustand";
import { chatServices } from "@/services/chatServices";
import type { Conversation, MessageWithSender } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  messages: { [conversationId: string]: MessageWithSender[] };
  loading: boolean;
  
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  messages: {},
  loading: false,

  fetchConversations: async () => {
    set({ loading: true });
    try {
      const conversations = await chatServices.getConversations();
      set({ conversations });
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ loading: true });
    try {
      const messages = await chatServices.getMessages(conversationId);
      set(state => ({
        messages: { ...state.messages, [conversationId]: messages }
      }));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    try {
      const newMessage = await chatServices.sendMessage(conversationId, content);
      
      // Add message to state
      set(state => ({
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), newMessage]
        },
        conversations: state.conversations.map(conv =>
          conv._id === conversationId
            ? { ...conv, lastMessage: newMessage, updatedAt: newMessage.createdAt }
            : conv
        )
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      await chatServices.markAsRead(conversationId);
      
      // Update unread count
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv._id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      }));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  },
}));
```

### 3. Update ChatPage để sử dụng real data:

Thay thế mock data trong `ChatPage.tsx` bằng:

```typescript
import { useChatStore } from '@/stores/useChatStore';
import { useEffect } from 'react';

const ChatPage = () => {
  const { user } = useAuthStore();
  const { 
    conversations, 
    messages, 
    fetchConversations, 
    fetchMessages,
    sendMessage,
    markAsRead 
  } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      markAsRead(activeConversationId);
    }
  }, [activeConversationId]);

  // ... rest of the code
};
```

---

## 🎨 Customization

### Thay đổi màu sắc:
Màu sắc được quản lý qua Tailwind CSS. Bạn có thể tùy chỉnh trong file `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        muted: {...},
        // ...
      }
    }
  }
}
```

### Thêm emoji picker:
```bash
npm install @emoji-mart/react @emoji-mart/data
```

### Thêm WebSocket cho real-time:
```bash
npm install socket.io-client
```

---

## 📸 Features đề xuất mở rộng:

1. **Real-time messaging** với Socket.IO
2. **Gửi ảnh/file** attachment
3. **Emoji picker**
4. **Typing indicator** (đang nhập...)
5. **Online/offline status**
6. **Voice/video call** với WebRTC
7. **Message reactions** (like, love, etc.)
8. **Delete/Edit messages**
9. **Group chat**
10. **Message search**
11. **Push notifications**
12. **Dark/Light theme toggle**

---

## 🐛 Debugging

Nếu gặp lỗi TypeScript, đảm bảo:
1. Đã cài đặt `@radix-ui/react-avatar` và `@radix-ui/react-scroll-area`
2. File `lib/utils.ts` có function `cn()`
3. Các UI components khác (Button, Input, Card) đã tồn tại

---

## 📚 Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **Shadcn/ui** - UI Components
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Radix UI** - Headless components

---

## 🎯 Next Steps

1. ✅ Cài đặt dependencies
2. ⏳ Tạo backend API cho chat
3. ⏳ Tạo Chat Services
4. ⏳ Tạo Chat Store (Zustand)
5. ⏳ Thay mock data bằng real API
6. ⏳ Thêm WebSocket cho real-time
7. ⏳ Deploy lên production

---

Chúc bạn code vui vẻ! 🚀

