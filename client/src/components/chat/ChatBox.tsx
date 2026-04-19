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
          padding: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
