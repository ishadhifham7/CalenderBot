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
          padding: 16px 20px;
          max-width: 75%;
          font-family: var(--sans);
          font-size: 15px;
          line-height: 1.6;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .user {
          background: rgba(40, 42, 54, 0.4);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.25rem;
          border-bottom-right-radius: 0.25rem;
          text-align: right;
        }

        .assistant {
          background: rgba(16, 185, 129, 0.1);
          color: #f8fafc;
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 1.25rem;
          border-bottom-left-radius: 0.25rem;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;
