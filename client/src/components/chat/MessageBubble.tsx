import type { Message } from "../../features/assistant/types";

interface Props {
  message: Message;
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-wrapper ${isUser ? "user-wrapper" : "ai-wrapper"}`}
    >
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
          padding: 12px 16px;
          border-radius: 16px;
          max-width: 80%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-size: 14.5px;
          font-weight: 400;
          line-height: 1.55;
          letter-spacing: -0.015em;
          text-align: left;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
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
