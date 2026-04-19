import ChatBox from "../chat/ChatBox";
import ChatInput from "../chat/ChatInput";
import { useAssistant } from "../../features/assistant/assistantHooks";

const WidgetContainer = () => {
  const { messages, sendMessage, loading, error } = useAssistant();

  return (
    <div className="widget-container">
      <div className="widget-header">AI Assistant</div>

      <ChatBox messages={messages} />

      <ChatInput onSend={sendMessage} loading={loading} error={error} />

      <style>{`
        .widget-container {
          position: fixed;
          bottom: 20px;
          right: 20px;

          width: 340px;
          height: 520px;

          background: #ffffff;
          border-radius: 18px;

          box-shadow: 0 10px 30px rgba(0,0,0,0.15);

          display: flex;
          flex-direction: column;

          overflow: hidden;
          z-index: 9999;
        }

        .widget-header {
          background: #111827;
          color: white;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default WidgetContainer;
