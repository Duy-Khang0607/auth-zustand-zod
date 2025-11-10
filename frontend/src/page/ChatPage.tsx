import { useState, useMemo } from 'react';
import Logout from '@/components/auth/Logout';
import { useAuthStore } from '@/stores/useAuthStore';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyChat } from '@/components/chat/EmptyChat';
import type { Conversation, MessageWithSender } from '@/types/chat';

// Mock data - sẽ thay bằng API call thực tế
const mockConversations: Conversation[] = [
  {
    _id: '1',
    participants: [
      {
        _id: 'user1',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
        displayName: 'Nguyễn Văn A',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      },
      {
        _id: 'user2',
        username: 'tranthib',
        email: 'tranthib@example.com',
        displayName: 'Trần Thị B',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      }
    ],
    lastMessage: {
      _id: 'msg1',
      conversationId: '1',
      senderId: 'user2',
      content: 'Chào bạn! Hẹn gặp lại nhé 👋',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
    },
    unreadCount: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '2',
    participants: [
      {
        _id: 'user1',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
        displayName: 'Nguyễn Văn A',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      },
      {
        _id: 'user3',
        username: 'levanc',
        email: 'levanc@example.com',
        displayName: 'Lê Văn C',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
      }
    ],
    lastMessage: {
      _id: 'msg2',
      conversationId: '2',
      senderId: 'user1',
      content: 'Ok, tôi sẽ gửi file cho bạn sớm nhất có thể',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: '3',
    participants: [
      {
        _id: 'user1',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
        displayName: 'Nguyễn Văn A',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      },
      {
        _id: 'user4',
        username: 'phamthid',
        email: 'phamthid@example.com',
        displayName: 'Phạm Thị D',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      }
    ],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const mockMessages: { [conversationId: string]: MessageWithSender[] } = {
  '1': [
    {
      _id: 'msg1-1',
      conversationId: '1',
      senderId: 'user2',
      content: 'Xin chào! Bạn khỏe không?',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
      sender: {
        _id: 'user2',
        username: 'tranthib',
        email: 'tranthib@example.com',
        displayName: 'Trần Thị B',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      }
    },
    {
      _id: 'msg1-2',
      conversationId: '1',
      senderId: 'user1',
      content: 'Mình khỏe, cảm ơn bạn! Còn bạn thì sao?',
      createdAt: new Date(Date.now() - 86300000).toISOString(),
      updatedAt: new Date(Date.now() - 86300000).toISOString(),
      isRead: true,
      sender: {
        _id: 'user1',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
        displayName: 'Nguyễn Văn A',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      }
    },
    {
      _id: 'msg1-3',
      conversationId: '1',
      senderId: 'user2',
      content: 'Mình cũng khỏe nha. Dạo này bận việc lắm 😅',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
      sender: {
        _id: 'user2',
        username: 'tranthib',
        email: 'tranthib@example.com',
        displayName: 'Trần Thị B',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      }
    },
    {
      _id: 'msg1-4',
      conversationId: '1',
      senderId: 'user2',
      content: 'Chào bạn! Hẹn gặp lại nhé 👋',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
      sender: {
        _id: 'user2',
        username: 'tranthib',
        email: 'tranthib@example.com',
        displayName: 'Trần Thị B',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      }
    },
  ],
  '2': [
    {
      _id: 'msg2-1',
      conversationId: '2',
      senderId: 'user3',
      content: 'Bạn có thể gửi file tài liệu cho mình được không?',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      updatedAt: new Date(Date.now() - 10800000).toISOString(),
      isRead: true,
      sender: {
        _id: 'user3',
        username: 'levanc',
        email: 'levanc@example.com',
        displayName: 'Lê Văn C',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
      }
    },
    {
      _id: 'msg2-2',
      conversationId: '2',
      senderId: 'user1',
      content: 'Ok, tôi sẽ gửi file cho bạn sớm nhất có thể',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
      sender: {
        _id: 'user1',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
        displayName: 'Nguyễn Văn A',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      }
    },
  ],
  '3': [],
};

const ChatPage = () => {
  const { user } = useAuthStore();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<{ [key: string]: MessageWithSender[] }>(mockMessages);

  // Get active conversation
  const activeConversation = useMemo(() => {
    return conversations.find(c => c._id === activeConversationId);
  }, [conversations, activeConversationId]);

  // Get other participant in active conversation
  const otherUser = useMemo(() => {
    if (!activeConversation || !user) return null;
    return activeConversation.participants.find(p => p._id !== user._id) || null;
  }, [activeConversation, user]);

  // Get messages for active conversation
  const currentMessages = useMemo(() => {
    return activeConversationId ? messages[activeConversationId] || [] : [];
  }, [messages, activeConversationId]);

  const handleSendMessage = (content: string) => {
    if (!activeConversationId || !user) return;

    const newMessage: MessageWithSender = {
      _id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: user._id,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRead: false,
      sender: user,
    };

    // Add message to messages list
    setMessages(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
    }));

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv._id === activeConversationId
          ? {
              ...conv,
              lastMessage: newMessage,
              updatedAt: newMessage.createdAt,
            }
          : conv
      )
    );

    // TODO: Send to API
    console.log('Sending message:', newMessage);
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);

    // Mark messages as read
    setConversations(prev =>
      prev.map(conv =>
        conv._id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    // TODO: Call API to mark messages as read
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar with user info and logout */}
      <div className="h-16 border-b px-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Chat App</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user.displayName}
          </span>
          <Logout />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUser={user}
          onSelectConversation={handleSelectConversation}
        />

        {/* Chat content */}
        {activeConversation && otherUser ? (
          <div className="flex-1 flex flex-col">
            <ChatHeader otherUser={otherUser} />
            <ChatMessages messages={currentMessages} currentUser={user} />
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
