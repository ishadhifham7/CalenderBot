import ChatBox from "../chat/ChatBox";
import ChatInput from "../chat/ChatInput";
import { useAssistant } from "../../features/assistant/assistantHooks";

const WidgetContainer = () => {
  const { messages, sendMessage, loading, error } = useAssistant();

  return (
    <div className="widget-container">
      <div className="widget-header">CalenderBot</div>

      <ChatBox messages={messages} />

      <ChatInput onSend={sendMessage} loading={loading} error={error} />

      <style>{`
        .widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          height: 600px;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .widget-header {
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          color: #f8fafc;
          padding: 16px 20px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .widget-header::before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default WidgetContainer;
