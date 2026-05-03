import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
  error: string | null;
}

const ChatInput = ({ onSend, loading, error }: Props) => {
  const [text, setText] = useState<string>("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="chat-input-container">
      {error ? <div className="chat-error-toast">{error}</div> : null}

      <div className="input-group">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          disabled={loading}
        />

        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          className={loading ? "btn-loading" : ""}
        >
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>

      <style>{`
        .chat-input-container {
          position: relative;
          width: 100%;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 8px 8px 8px 24px;
          transition: border-color 0.2s, background 0.2s;
        }

        .input-group:focus-within {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(255, 255, 255, 0.08);
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          color: #f8fafc;
          font-family: var(--sans);
          font-size: 15px;
          outline: none;
          padding: 8px 0;
        }

        input::placeholder {
          color: #64748b;
        }

        button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid transparent;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover:not(:disabled) {
          background: rgba(16, 185, 129, 0.25);
          transform: scale(1.05);
        }

        button:disabled {
          background: rgba(255, 255, 255, 0.05);
          color: #64748b;
          cursor: not-allowed;
        }

        .chat-error-toast {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(220, 38, 38, 0.2);
          backdrop-filter: blur(8px);
          color: #fca5a5;
          font-size: 13px;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid rgba(220, 38, 38, 0.3);
          animation: slideUpFade 0.3s ease;
          white-space: nowrap;
        }

        @keyframes slideUpFade {
          from { transform: translate(-50%, 10px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(16, 185, 129, 0.3);
          border-radius: 50%;
          border-top-color: #10b981;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
