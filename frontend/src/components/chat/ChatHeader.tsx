import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";
import type { User } from "@/types/user";

interface ChatHeaderProps {
  otherUser: User;
}

export const ChatHeader = ({ otherUser }: ChatHeaderProps) => {
  return (
    <div className="h-16 border-b bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUser.avatarUrl} alt={otherUser.displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {otherUser.displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-semibold">{otherUser.displayName}</h3>
          <p className="text-xs text-muted-foreground">Đang hoạt động</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

