import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { MessageWithSender } from "@/types/chat";
import type { User } from "@/types/user";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: MessageWithSender[];
  currentUser: User;
}

export const ChatMessages = ({ messages, currentUser }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const groupMessagesByDate = (messages: MessageWithSender[]) => {
    const groups: { [key: string]: MessageWithSender[] } = {};
    
    messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            Chưa có tin nhắn nào.<br />
            Hãy bắt đầu cuộc trò chuyện!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(messageGroups).map(([date, messagesInGroup]) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {date}
                </div>
              </div>

              {/* Messages */}
              {messagesInGroup.map((message, index) => {
                const isCurrentUser = message.senderId === currentUser._id;
                const showAvatar = index === 0 || 
                  messagesInGroup[index - 1].senderId !== message.senderId;

                return (
                  <div
                    key={message._id}
                    className={cn(
                      "flex gap-2 mb-2",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isCurrentUser && (
                      <Avatar className={cn("w-8 h-8", !showAvatar && "invisible")}>
                        <AvatarImage 
                          src={message.sender.avatarUrl} 
                          alt={message.sender.displayName} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {message.sender.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={cn("flex flex-col", isCurrentUser && "items-end")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 max-w-md break-words",
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 px-2">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>

                    {isCurrentUser && (
                      <Avatar className={cn("w-8 h-8", !showAvatar && "invisible")}>
                        <AvatarImage 
                          src={currentUser.avatarUrl} 
                          alt={currentUser.displayName} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {currentUser.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

