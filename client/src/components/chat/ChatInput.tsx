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
          placeholder="Message..."
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
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
          padding: 16px 20px 24px;
          background: #0f172a;
          border-top: 1px solid #1e293b;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 4px 4px 4px 14px;
        }

        .input-group:focus-within {
          border-color: #475569;
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          color: #f8fafc;
          font-size: 14px;
          outline: none;
          padding: 8px 0;
        }

        input::placeholder {
          color: #64748b;
        }

        button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        button:disabled {
          background: #334155;
          color: #64748b;
          cursor: not-allowed;
        }

        .chat-error-toast {
          position: absolute;
          bottom: 80px;
          left: 20px;
          right: 20px;
          background: #450a0a;
          color: #fecaca;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #7f1d1d;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(5px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(15, 23, 42, 0.2);
          border-radius: 50%;
          border-top-color: #0f172a;
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
