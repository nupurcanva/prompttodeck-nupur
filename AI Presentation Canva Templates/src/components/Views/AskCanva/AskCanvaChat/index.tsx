import React from "react";
import CanvaAIPanel from "@/components/SideNav/CanvaAIPanel";
import "./style.css";

interface AskCanvaChatProps {
  isVisible: boolean;
  onClose: () => void;
}

const AskCanvaChat: React.FC<AskCanvaChatProps> = ({ isVisible, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="ask-canva-chat-overlay">
      <div className="ask-canva-chat-container">
        <CanvaAIPanel onClose={onClose} />
      </div>
    </div>
  );
};

export default AskCanvaChat;
