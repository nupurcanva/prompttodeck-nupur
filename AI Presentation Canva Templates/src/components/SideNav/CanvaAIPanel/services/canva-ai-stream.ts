import { AIService } from "@canva-ct/genai";
import type { AIChatRequest } from "@canva-ct/genai";
import {
  isStreaming,
  addCanvaAIMessage,
  updateCanvaAIStreamingContent,
  finalizeCanvaAIStreaming,
  stopStreamingForThreadChange,
  getCanvaAIConfig,
  getCanvaAIHistoryForAPI,
} from "../state";

// Create service instance
const aiService = new AIService({ defaultModel: 'anthropic/claude-sonnet-4' });

// Canva AI streaming service class
class CanvaAIStreamingService {
  private streamingContentRef = "";
  private currentEmitter: any = null;

  async startCanvaAIChatStream(message: string): Promise<void> {
    console.log("🚀 startCanvaAIChatStream called with message:", message);
    try {
      // Ensure any previous streaming content is saved before adding new user message
      if (this.streamingContentRef.trim()) {
        addCanvaAIMessage({
          type: "assistant",
          content: this.streamingContentRef.trim(),
          timestamp: new Date().toISOString(),
        });
        this.streamingContentRef = "";
      }

      // Clear any lingering streaming display content
      updateCanvaAIStreamingContent("");

      // Set loading state to true
      isStreaming.value = true;

      // Get AI configuration and history from state
      const config = getCanvaAIConfig();
      const history = getCanvaAIHistoryForAPI();

      // Add user message to state
      console.log("🧪 About to add USER message:", message.trim());
      addCanvaAIMessage({
        type: "user",
        content: message.trim(),
        timestamp: new Date().toISOString(),
      });

      // Reset streaming content reference
      this.streamingContentRef = "";

      // Build the complete message history for the request
      const messages = [
        // Start with system message from config
        ...config.messages.filter(msg => msg.role === "system"),
        // Add conversation history
        ...history.map(msg => ({
          role: msg.role as "system" | "user" | "assistant",
          content: msg.content,
        })),
        // Add the current user message
        {
          role: "user" as const,
          content: message,
        },
      ];

      // Create the proper request using the config structure
      const request: AIChatRequest = {
        messages,
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        tools: config.tools && config.tools.length > 0 ? config.tools : [],
        stream: true,
      };


      this.currentEmitter = aiService.chat(
        request,
        {
          onMessage: (event) => {
            if (event.type === "on_chat_model_stream") {
              const streamContent = event.content || "";
              this.streamingContentRef += streamContent;
              updateCanvaAIStreamingContent(this.streamingContentRef);
            }

            if (event.type === "on_chat_model_end") {
              // Save the streamed content as permanent assistant message
              if (this.streamingContentRef.trim()) {
                console.log("🧪 About to add ASSISTANT message (on_chat_model_end):", this.streamingContentRef.trim().substring(0, 50) + "...");
                addCanvaAIMessage({
                  type: "assistant",
                  content: this.streamingContentRef.trim(),
                  timestamp: new Date().toISOString(),
                });
              }
              this.streamingContentRef = "";
            }

            if (event.type === "on_tool_start") {
              // Tool execution begins
            }

            if (event.type === "on_tool_end") {
              console.log("🔧 on_tool_end event:", event);
              if (event.content !== undefined) {
                // Save any accumulated streaming content as assistant message first
                if (this.streamingContentRef.trim()) {
                  console.log("🧪 About to add ASSISTANT message (on_tool_end):", this.streamingContentRef.trim().substring(0, 50) + "...");
                  addCanvaAIMessage({
                    type: "assistant",
                    content: this.streamingContentRef.trim(),
                    timestamp: new Date().toISOString(),
                  });
                }
                this.streamingContentRef = "";
                console.log("🔧 Calling handleToolResult with:", { tool_name: event.tool_name, output: event.content });
                this.handleToolResult(event.tool_name, event.content);
              }
            }
          },
          onComplete: () => {
            this.streamingContentRef = "";
            isStreaming.value = false;
          },
          onError: () => {
            isStreaming.value = false;
            addCanvaAIMessage({
              type: "notification",
              content: "Connection error occurred",
              timestamp: new Date().toISOString(),
            });
          },
        }
      );

      // Don't add the stream ID as a message - it's just an identifier
    } catch (error) {
      isStreaming.value = false;
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      addCanvaAIMessage({
        type: "notification",
        content: `Chat error: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private handleToolResult(toolName: string | undefined, content: any): void {
    console.log("🔧 handleToolResult called with:", {
      toolName,
      content,
      contentType: typeof content,
      contentKeys: content && typeof content === "object" ? Object.keys(content) : null
    });

    // Parse content if it's a JSON string
    let parsedContent = content;
    if (typeof content === "string") {
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        // If it's not JSON, use the string as-is
        parsedContent = content;
      }
    }

    // Extract data if it's nested in a data property
    if (parsedContent && typeof parsedContent === "object" && parsedContent.data) {
      console.log("🔧 Extracting data property:", parsedContent.data);
      parsedContent = parsedContent.data;
    }

    console.log("🔧 Final parsedContent:", { parsedContent, keys: parsedContent && typeof parsedContent === "object" ? Object.keys(parsedContent) : null });

    switch (toolName) {
      case "create_notification":
        // Handle different notification response structures
        let notificationMessage = "Notification received";

        if (typeof parsedContent === "string") {
          notificationMessage = parsedContent;
        } else if (parsedContent && typeof parsedContent === "object") {
          // Try different possible property names
          notificationMessage =
            parsedContent.message || parsedContent.text || parsedContent.content || "Notification received";
        }

        addCanvaAIMessage({
          type: "notification",
          content: notificationMessage,
          timestamp: new Date().toISOString(),
        });
        break;

      case "generate_image":
        console.log("🎨 Handling generate_image tool result:", parsedContent);

        // Extract original_request and prompts from the tool output
        const originalRequest = parsedContent.original_request || parsedContent.originalRequest || "";
        const prompts = parsedContent.prompts || [];

        if (prompts.length === 4) {
          addCanvaAIMessage({
            type: "image_gallery",
            content: `Generating ${prompts.length} image variations`,
            timestamp: new Date().toISOString(),
            originalRequest,
            prompts,
          } as any);
        } else {
          console.error("❌ Expected 4 prompts, got:", prompts.length);
          addCanvaAIMessage({
            type: "notification",
            content: `Error: Expected 4 image prompts, but received ${prompts.length}`,
            timestamp: new Date().toISOString(),
          });
        }
        break;

      default:
        // Unknown tool - ignore
        break;
    }
  }

  // Only stop streaming when explicitly requested (e.g., thread changes)
  stopStream(): void {
    if (this.currentEmitter && this.currentEmitter.isActive()) {
      this.currentEmitter.cancel();
    }
    this.currentEmitter = null;
    // Use the state function to properly reset streaming
    stopStreamingForThreadChange();
  }

  // Method to force reset streaming state if it gets stuck
  forceResetStreaming(): void {
    console.log("🎨 Force resetting streaming state");
    if (this.currentEmitter && this.currentEmitter.isActive()) {
      this.currentEmitter.cancel();
    }
    this.currentEmitter = null;
    // Use the state function to properly reset streaming
    stopStreamingForThreadChange();
    finalizeCanvaAIStreaming();
  }
}

// Create and export singleton instance
const canvaAIStreamingService = new CanvaAIStreamingService();

export default canvaAIStreamingService;