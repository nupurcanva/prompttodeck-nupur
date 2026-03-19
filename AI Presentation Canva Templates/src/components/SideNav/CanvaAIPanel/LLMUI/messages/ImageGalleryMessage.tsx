import React from "react";
import "./ImageGalleryMessage.css";
import ImageGalleryItem from "./ImageGalleryItem";
import type { ImageGalleryMessage } from "../../state";

export interface ImageGalleryMessageProps {
  message: ImageGalleryMessage;
  onImageClick?: (url: string) => void;
}

const ImageGalleryMessage: React.FC<ImageGalleryMessageProps> = ({
  message,
  onImageClick,
}) => {
  const { originalRequest, prompts } = message;

  console.log("🖼️ ImageGalleryMessage render:", {
    originalRequest,
    promptsCount: prompts.length,
    prompts,
  });

  return (
    <div className="image-carousel-container">
      <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
        Generating images for: <strong>{originalRequest}</strong>
      </div>
      <div className="image-carousel">
        {prompts.map((prompt, index) => (
          <ImageGalleryItem
            key={`${message.id}-${index}`}
            prompt={prompt}
            index={index}
            onImageClick={onImageClick}
          />
        ))}
      </div>
      <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
        {prompts.length} image variations
      </div>
    </div>
  );
};

export default ImageGalleryMessage;
