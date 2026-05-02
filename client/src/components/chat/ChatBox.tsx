import MessageBubble from "./MessageBubble";
import type { Message } from "../../features/assistant/types";

interface Props {
  messages: Message[];
}

const ChatBox = ({ messages }: Props) => {
  return (
    <div className="chat-box">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      <style>{`
        .chat-box {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: transparent;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .chat-box::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-box::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .chat-box::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.1);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
