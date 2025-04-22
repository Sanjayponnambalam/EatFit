
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ChatHistoryProps {
  conversations: {
    id: string;
    title: string;
    timestamp: Date;
  }[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold px-2">Recent Chats</h2>
      
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-2 pr-4">
          {conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No chat history yet
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors ${
                  currentConversationId === conv.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary"
                }`}
              >
                <div 
                  className="flex items-center gap-2 flex-1 overflow-hidden"
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{conv.title}</span>
                </div>
                
                <AlertDialog open={confirmDeleteId === conv.id} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7 opacity-60 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(conv.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete chat</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this chat? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => {
                          onDeleteConversation(conv.id);
                          setConfirmDeleteId(null);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
