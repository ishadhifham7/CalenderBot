import type { Message } from "../../features/assistant/types";

interface Props {
  message: Message;
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`bubble ${isUser ? "user" : "assistant"}`}>
      {message.content}

      <style>{`
        .bubble {
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 10px;
          max-width: 80%;
          font-size: 13px;
          line-height: 1.4;
        }

        .user {
          background: #111827;
          color: white;
          margin-left: auto;
        }

        .assistant {
          background: #e5e7eb;
          color: black;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;
