import { useEffect, useState } from "react";

interface ThinkingIndicatorProps {
  step: string | null;
}

const ThinkingIndicator = ({ step }: ThinkingIndicatorProps) => {
  const [displayedText, setDisplayedText] = useState<string | null>(step);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // If exact same text or going from null -> text, no fade out needed
    if (step === displayedText) return;

    if (step === null) {
      // Disappear immediately when step is cleared
      setDisplayedText(null);
      setIsFadingOut(false);
      return;
    }

    if (displayedText !== null) {
      // We have existing text, start fade out
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setDisplayedText(step);
        setIsFadingOut(false);
      }, 250); // Matches CSS fade transition duration
      return () => clearTimeout(timer);
    } else {
      // Display first step directly
      setDisplayedText(step);
    }
  }, [step, displayedText]);

  if (!step && !displayedText) return null;

  return (
    <div
      className={`thinking-indicator ${isFadingOut ? "fade-out" : "fade-in"}`}
    >
      <span className="pulse-dot" />
      <span className="thinking-text">{displayedText}</span>

      <style>{`
        .thinking-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          transition: opacity 0.25s ease-in-out;
        }

        .thinking-indicator.fade-in {
          opacity: 1;
        }

        .thinking-indicator.fade-out {
          opacity: 0;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #10b981; /* theme green */
          border-radius: 50%;
          animation: pulse 1.2s infinite ease-in-out;
        }

        .thinking-text {
          font-family: var(--sans, system-ui, -apple-system, sans-serif);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default ThinkingIndicator;
