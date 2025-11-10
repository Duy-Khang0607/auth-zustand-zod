import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/chat";
import type { User } from "@/types/user";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentUser: User;
  onSelectConversation: (conversationId: string) => void;
}

export const ChatSidebar = ({ 
  conversations, 
  activeConversationId, 
  currentUser,
  onSelectConversation 
}: ChatSidebarProps) => {
  
  const getOtherParticipant = (conversation: Conversation): User => {
    return conversation.participants.find(p => p._id !== currentUser._id) || conversation.participants[0];
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Tìm kiếm cuộc trò chuyện..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const isActive = conversation._id === activeConversationId;
              
              return (
                <div
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation._id)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                    isActive && "bg-accent"
                  )}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={otherUser.avatarUrl} alt={otherUser.displayName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {otherUser.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {otherUser.displayName}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conversation.lastMessage?.content || "Bắt đầu cuộc trò chuyện"}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

