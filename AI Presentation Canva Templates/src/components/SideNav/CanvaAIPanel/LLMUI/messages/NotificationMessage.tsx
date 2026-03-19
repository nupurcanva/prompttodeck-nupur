import React from "react";

interface NotificationMessageProps {
  id: string;
  content: string;
  timestamp: string;
}

const NotificationMessage: React.FC<NotificationMessageProps> = ({ content }) => {
  return (
    <div>
      <div className="flex items-center my-2 ml-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-3"></div>
        <div className="text-xs text-gray-600">{content}</div>
      </div>
    </div>
  );
};

export default NotificationMessage;
