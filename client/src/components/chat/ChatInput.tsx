import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

const ChatInput = ({ onSend, loading }: Props) => {
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
        Send
      </button>

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
      `}</style>
    </div>
  );
};

export default ChatInput;
