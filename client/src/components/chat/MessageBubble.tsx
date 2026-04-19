import type { Message } from "../../features/assistant/types";

interface Props {
  message: Message;
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`message-wrapper ${isUser ? "user-wrapper" : "ai-wrapper"}`}>
      <div className={`bubble ${isUser ? "user" : "assistant"}`}>
        {message.content}
      </div>

      <style>{`
        .message-wrapper {
          display: flex;
          width: 100%;
        }

        .user-wrapper {
          justify-content: flex-end;
        }

        .ai-wrapper {
          justify-content: flex-start;
        }

        .bubble {
          padding: 10px 14px;
          border-radius: 14px;
          max-width: 80%;
          font-size: 14px;
          line-height: 1.5;
          letter-spacing: -0.01em;
          text-align: left;
        }

        .user {
          background: #334155;
          color: #ffffff;
          border-bottom-right-radius: 4px;
          text-align: right;
        }

        .assistant {
          background: #1e293b;
          color: #f1f5f9;
          border-bottom-left-radius: 4px;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;
