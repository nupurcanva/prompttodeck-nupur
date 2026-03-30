import React from "react";
import NavigationContainer from "../../Layouts/NavigationContainer";
import MainContainer from "../../Layouts/MainContainer";
import { ChatGPTPreviewProvider } from "@/contexts/ChatGPTPreviewContext";
import "./style.css";

const PresentationView: React.FC = () => {
  return (
    <div className="presentation-wrapper presentation-view">
      <ChatGPTPreviewProvider>
        <NavigationContainer showCanvaAI={true} isCanvaAIView={true}>
          <MainContainer />
        </NavigationContainer>
      </ChatGPTPreviewProvider>
    </div>
  );
};

export default PresentationView;
