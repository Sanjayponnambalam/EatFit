
import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import ChatHistory from "@/components/ChatHistory";
import NewChatButton from "@/components/NewChatButton";
import UserMenu from "@/components/UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { 
    conversations, 
    currentConversation, 
    isGenerating, 
    sendMessage, 
    selectConversation, 
    createNewConversation, 
    deleteConversation 
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation?.messages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-light text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-xl">🥗</span>
          </div>
          <h1 className="text-xl font-bold">EatFit AI Chef</h1>
        </div>
        <UserMenu />
      </header>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {!isMobile && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r">
                <div className="h-full flex flex-col p-4">
                  <NewChatButton 
                    onClick={createNewConversation} 
                    disabled={isGenerating}
                  />
                  
                  <Separator className="my-4" />
                  
                  <ChatHistory 
                    conversations={conversations}
                    currentConversationId={currentConversation?.id || null}
                    onSelectConversation={selectConversation}
                    onDeleteConversation={deleteConversation}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          
          <ResizablePanel defaultSize={isMobile ? 100 : 80}>
            <div className="h-full flex flex-col p-4">
              {isMobile && (
                <div className="mb-4">
                  <NewChatButton 
                    onClick={createNewConversation} 
                    disabled={isGenerating}
                  />
                </div>
              )}
              
              {currentConversation ? (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="max-w-3xl mx-auto">
                      {currentConversation.messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <span className="text-3xl">🥗</span>
                          </div>
                          <h2 className="text-2xl font-bold mb-2">Welcome to EatFit AI Chef</h2>
                          <p className="text-muted-foreground mb-6 max-w-md">
                            I can help create personalized healthy recipes based on your preferences, 
                            dietary restrictions, and fitness goals.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                            {[
                              "I need a protein-rich vegetarian dinner",
                              "Create a keto-friendly lunch recipe",
                              "Suggest a quick breakfast under 300 calories",
                              "Make an Indian curry with chickpeas"
                            ].map((example, i) => (
                              <button
                                key={i}
                                className="p-3 border rounded-lg text-left hover:bg-primary/5 transition-colors"
                                onClick={() => sendMessage(example)}
                                disabled={isGenerating}
                              >
                                {example}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          {currentConversation.messages.map((message) => (
                            <ChatMessage
                              key={message.id}
                              message={message.content}
                              isUser={message.isUser}
                              timestamp={message.timestamp}
                              messageId={message.id}
                            />
                          ))}
                          {isGenerating && (
                            <div className="flex w-full mb-4 justify-start">
                              <div className="recipe-bubble ml-2 flex items-center">
                                <div className="flex space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                                </div>
                                <span className="ml-3 text-sm text-muted-foreground">Creating your healthy recipe...</span>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="pt-4 max-w-3xl mx-auto w-full">
                    <ChatInput 
                      onSendMessage={sendMessage} 
                      isGenerating={isGenerating} 
                    />
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Select or create a conversation to get started</p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Dashboard;
