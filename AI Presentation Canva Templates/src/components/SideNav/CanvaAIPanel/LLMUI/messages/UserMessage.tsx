import React from "react";
import type { UserMessageData } from "./types";

interface UserMessageProps extends UserMessageData {}

const UserMessage: React.FC<UserMessageProps> = ({ content, timestamp }) => {
  return (
    <div className="flex justify-end">
      <div className="flex items-start max-w-xs lg:max-w-md xl:max-w-lg flex-row-reverse">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
        text-sm bg-gray-50 text-blue-600 ml-2"
        >
          👤
        </div>
        <div className="rounded-lg px-4 py-2 bg-purple-50 text-gray-900">
          <div className="text-sm whitespace-pre-wrap">{content}</div>
          <div className="text-xs mt-1 text-gray-500">
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
