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
    <div className="chat-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask something..."
        disabled={loading}
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {error ? <p className="chat-error">{error}</p> : null}

      <style>{`
        .chat-input {
          display: flex;
          padding: 10px;
          gap: 8px;
          border-top: 1px solid #e5e7eb;
        }

        input {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 13px;
        }

        button {
          padding: 8px 12px;
          background: #111827;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
        }

        .chat-error {
          margin: 0;
          font-size: 12px;
          color: #b91c1c;
          position: absolute;
          bottom: 48px;
          left: 10px;
          right: 10px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 6px 8px;
        }

        .chat-input {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
