import React from "react";
import type { AssistantMessageData } from "./types";
import MagicFilledIcon from "@assets/icons/comment-icons/magic-filled.svg";

interface AssistantMessageProps extends AssistantMessageData {}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  timestamp,
  isStreaming = false,
}) => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start max-w-xs lg:max-w-md xl:max-w-lg">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-50 to-blue-50 border border-blue-200
        text-gray-600 mr-2 flex items-center justify-center text-sm"
        >
          <img src={MagicFilledIcon} alt="Canva AI" className="w-5 h-5" />
        </div>
        <div className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2">
          <div className="text-sm prose prose-sm max-w-none prose-gray">
            <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantMessage;
