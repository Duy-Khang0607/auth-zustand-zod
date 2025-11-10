import { MessageSquare } from "lucide-react";

export const EmptyChat = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Chọn một cuộc trò chuyện</h2>
        <p className="text-muted-foreground">
          Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
        </p>
      </div>
    </div>
  );
};

