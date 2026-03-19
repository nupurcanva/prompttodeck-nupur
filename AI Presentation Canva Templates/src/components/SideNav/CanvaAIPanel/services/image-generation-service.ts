import { AIService } from "@canva-ct/genai";

// Create AI service instance
const aiService = new AIService({ defaultModel: 'google/gemini-2.5-flash-image-preview' });

/**
 * Service for generating images using Google Gemini via OpenRouter
 */
class ImageGenerationService {
  /**
   * Generate a single image from a text prompt
   * @param prompt The text prompt for image generation
   * @returns The generated image URL or base64 data
   */
  async generateImage(prompt: string): Promise<string> {
    try {
      console.log("🎨 Generating image with prompt:", prompt);

      const response = await aiService.generateImage({
        prompt,
        model: "google/gemini-2.5-flash-image-preview",
        temperature: 0.7,
        max_tokens: 200,
        systemMessage: "Generate high-quality, detailed images based on the prompt",
      });

      console.log("✅ Image generation response:", response);

      // The new AIService provides imageUrl directly
      if (response.imageUrl) {
        return response.imageUrl;
      }

      throw new Error("No image URL found in response");
    } catch (error) {
      console.error("❌ Image generation error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const imageGenerationService = new ImageGenerationService();
