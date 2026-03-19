import React, { useEffect, useState } from "react";
import { imageGenerationService } from "../../services/image-generation-service";

export interface ImageGalleryItemProps {
  prompt: string;
  index: number;
  onImageClick?: (url: string) => void;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  prompt,
  index,
  onImageClick,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const generateImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`🎨 [Item ${index + 1}] Starting image generation with prompt:`, prompt);

        const url = await imageGenerationService.generateImage(prompt);

        console.log(`✅ [Item ${index + 1}] Image generated successfully:`, url);

        setImageUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error(`❌ [Item ${index + 1}] Image generation failed:`, err);

        const errorMessage = err instanceof Error ? err.message : "Failed to generate image";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    generateImage();
  }, [prompt, index]);

  const handleClick = () => {
    if (imageUrl && onImageClick) {
      setIsSelected(true);
      onImageClick(imageUrl);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="image-item loading">
        <div className="image-wrapper">
          <div className="image-loading-placeholder" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="image-item" style={{ border: "2px solid #fcc" }}>
        <div
          className="image-wrapper"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fee",
            padding: "8px",
          }}
        >
          <div style={{ fontSize: "10px", color: "#c33", textAlign: "center" }}>
            <div style={{ marginBottom: "4px" }}>❌</div>
            <div>Error</div>
          </div>
        </div>
      </div>
    );
  }

  // Success state with image
  return (
    <div
      className={`image-item ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="image-wrapper">
        <img
          src={imageUrl || ""}
          alt={`Generated ${index + 1}`}
          className="carousel-image"
          onError={() => {
            console.log(`❌ [Item ${index + 1}] Image failed to load`);
            setError("Failed to load image");
          }}
        />
        {isSelected && (
          <div className="selection-overlay">
            <div className="checkmark">✓</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGalleryItem;
