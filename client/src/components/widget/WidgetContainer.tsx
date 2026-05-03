import ChatBox from "../chat/ChatBox";
import ChatInput from "../chat/ChatInput";
import ThinkingIndicator from "../chat/ThinkingIndicator";
import { useAssistant } from "../../features/assistant/assistantHooks";

const WidgetContainer = () => {
  const { messages, sendMessage, loading, error, thinkingStep } =
    useAssistant();

  return (
    <div className="web-chat-container">
      <div className="chat-glass-layer">
        <div className="chat-header floating-plate">
          <div className="header-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="header-title">CalenderBot Assistant</h2>
            <span className="header-subtitle">Online & ready to help</span>
          </div>
        </div>

        <hr className="separator" />

        <div className="chat-body">
          <ChatBox messages={messages} />
          {thinkingStep && (
            <div className="thinking-wrapper">
              <ThinkingIndicator step={thinkingStep} />
            </div>
          )}
        </div>

        <div className="chat-footer floating-plate">
          <ChatInput onSend={sendMessage} loading={loading} error={error} />
        </div>
      </div>

      <style>{`
        .web-chat-container {
          width: 100%;
          max-width: 900px;
          height: 85vh;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .chat-glass-layer {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: rgba(11, 12, 16, 0.4);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .chat-glass-layer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 80%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .floating-plate {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          z-index: 10;
        }

        .chat-header {
          display: flex;
          align-items: center;
          padding: 20px 32px;
          gap: 16px;
        }

        .header-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .header-icon svg {
          width: 20px;
          height: 20px;
        }

        .header-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .header-subtitle {
          font-size: 13px;
          color: #94a3b8;
        }

        .separator {
          margin: 0;
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .chat-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .thinking-wrapper {
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: flex-start;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: linear-gradient(to top, rgba(11, 12, 16, 0.9), transparent);
          padding-bottom: 8px;
        }

        .chat-footer {
          padding: 20px 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default WidgetContainer;
