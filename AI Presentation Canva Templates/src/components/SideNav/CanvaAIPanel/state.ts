import { signal } from '@preact/signals-react';
import type { AIChatRequest, ToolDefinition } from '@canva-ct/genai';

// Thread ID state
export const threadId = signal<string | null>(null);

export const agentSessionActive = signal<boolean>(false);
export const isStreaming = signal(false);

// CanvaAI Chat Message Types

// Base message interface
interface BaseCanvaAIMessage {
  id: string;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

// Dropdown option type for choice messages
export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

// Specific message type interfaces
export interface UserMessage extends BaseCanvaAIMessage {
  type: 'user';
}

export interface AssistantMessage extends BaseCanvaAIMessage {
  type: 'assistant';
}

export interface NotificationMessage extends BaseCanvaAIMessage {
  type: 'notification';
}

export interface SingleChoiceMessage extends BaseCanvaAIMessage {
  type: 'single_choice';
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOption?: DropdownOption;
  isLoading?: boolean;
}

export interface MultipleChoiceMessage extends BaseCanvaAIMessage {
  type: 'multiple_choice';
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOptions: DropdownOption[];
  isLoading?: boolean;
}

export interface ImageGalleryMessage extends BaseCanvaAIMessage {
  type: 'image_gallery';
  originalRequest: string;
  prompts: string[];
}

// Discriminated union type for all message types
export type CanvaAIChatMessage =
  | UserMessage
  | AssistantMessage
  | NotificationMessage
  | SingleChoiceMessage
  | MultipleChoiceMessage
  | ImageGalleryMessage;

// examples of tools
export const defaultTools: ToolDefinition[] = [
  {
    name: 'create_notification',
    description: 'Show user notification with different levels',
    parameters: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The notification message to display',
        },
        level: {
          type: 'string',
          enum: ['info', 'warning', 'error', 'success'],
          description: 'Notification level',
        },
      },
      required: ['message'],
    },
  },
  {
    name: 'generate_image',
    description:
      'Generate 4 varied image prompts based on an initial request, each optimized for image generation models',
    parameters: {
      type: 'object',
      properties: {
        original_request: {
          type: 'string',
          description: 'The original image generation request from the user',
        },
        prompts: {
          type: 'array',
          description: 'Array of 4 varied prompts based on the original request',
          items: {
            type: 'string',
            description: 'A detailed image generation prompt',
          },
          minItems: 4,
          maxItems: 4,
        },
      },
      required: ['original_request', 'prompts'],
    },
  },
];

// Default configuration
export const defaultCanvaAIConfig: AIChatRequest = {
  messages: [
    {
      role: 'system',
      content:
        'You are an AI assistant powered by @canva-ct/genai - a comprehensive AI toolkit that powers this Canva AI Template. This template is designed for designers working with Cursor to rapidly prototype and build AI-powered design applications.\n\nThe @canva-ct/genai package provides powerful capabilities:\n\n**Core Features:**\n- **Text-to-Speech (TTS)** - Convert text to natural-sounding speech with multiple voices (coral, sage, nova, etc.) and models (tts-1, tts-1-hd, gpt-4o-mini-tts)\n- **Image Generation** - Create images from text using Google Gemini models, with support for reference images and image-to-image transformations\n- **Image Analysis** - Analyze images, extract text (OCR), compare multiple images, and answer questions about visual content\n- **Audio Analysis** - Transcribe audio files (WAV, MP3) and analyze speaker tone, emotion, and background sounds\n- **LLM with Tools** - Use intelligent language models that can trigger UI events and autonomous actions in your application (show notifications, update UI elements, call APIs, etc.)\n- **Multimodal Support** - Process text, images, and audio together in a single request\n- **Streaming** - Real-time streaming responses for chat and content generation\n\n**Available Models:**\n- Google: gemini-2.5-flash, gemini-2.5-pro, gemini-2.5-flash-lite\n- Anthropic: claude-sonnet-4.5, claude-sonnet-4, claude-opus-4.1\n- OpenAI: gpt-5, gpt-5-mini\n- Perplexity: sonar-reasoning-pro, sonar-pro (for live web data)\n\nYou are a helpful chat assistant that can:\n1. **Answer questions** - Provide guidance about design workflows and explain @canva-ct/genai capabilities\n2. **Offer design advice** - Share best practices, tips, and creative suggestions\n3. **Assist with workflows** - Help users understand design processes and AI integration\n4. **Generate images** - Create visual content from descriptions or transform existing images\n5. **Use tools** - Trigger UI events like showing notifications, generating content, and interacting with the application\n6. **Explain features** - Help users understand what\'s possible with the @canva-ct/genai package\n\nFor designers using this template: You can customize this system prompt and add features to prototype any AI-powered functionality you can imagine. This is your playground for exploring how AI can enhance design applications.',
    },
  ],
  model: 'anthropic/claude-sonnet-4',
  temperature: 0.7,
  max_tokens: 4000,
  tools: defaultTools,
};

// CanvaAI configuration state
export const canvaAIConfig = signal<AIChatRequest>(defaultCanvaAIConfig);

// Helper functions for CanvaAI configuration
export const updateCanvaAIConfig = (updates: Partial<AIChatRequest>): void => {
  canvaAIConfig.value = {
    ...canvaAIConfig.value,
    ...updates,
  };
};

export const getCanvaAIConfig = (): AIChatRequest => {
  return canvaAIConfig.value;
};

export const resetCanvaAIConfig = (): void => {
  canvaAIConfig.value = { ...defaultCanvaAIConfig };
};

// Helper function to get conversation history from existing CanvaAI chat messages
export const getCanvaAIHistoryForAPI = (): Array<{
  role: string;
  content: string;
}> => {
  const messages = getCanvaAIMessagesForCurrentThread();
  return messages
    .filter(msg => msg.type === 'user' || msg.type === 'assistant')
    .map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
};

// CanvaAI Panel history - persistent across sessions
export const canvaAIChatMessages = signal<Record<string, CanvaAIChatMessage[]>>({});
export const canvaAICurrentStreamingContent = signal<string>('');
export const canvaAIStreamingMessageId = signal<string | null>(null);

// CanvaAI Helper Functions
export const addCanvaAIMessage = (message: Omit<CanvaAIChatMessage, 'id'>): void => {
  const currentThreadId = getOrCreateThreadId();
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const fullMessage: CanvaAIChatMessage = {
    id: messageId,
    ...message,
  } as CanvaAIChatMessage;

  const currentMessages = canvaAIChatMessages.value[currentThreadId] || [];

  canvaAIChatMessages.value = {
    ...canvaAIChatMessages.value,
    [currentThreadId]: [...currentMessages, fullMessage],
  };

  console.log(`[State] Added CanvaAI message to thread ${currentThreadId}:`, fullMessage);
};

export const updateCanvaAIMessage = (
  messageId: string,
  updates: Partial<CanvaAIChatMessage>,
): void => {
  const currentThreadId = threadId.value;
  if (!currentThreadId) {
    console.warn(`[State] Cannot update message ${messageId}: no active thread`);
    return;
  }

  const currentMessages = canvaAIChatMessages.value[currentThreadId] || [];
  const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);

  if (messageIndex === -1) {
    console.warn(
      `[State] Cannot update message ${messageId}: message not found in thread ${currentThreadId}`,
    );
    return;
  }

  const updatedMessages = [...currentMessages];
  updatedMessages[messageIndex] = {
    ...updatedMessages[messageIndex],
    ...updates,
  } as CanvaAIChatMessage;

  canvaAIChatMessages.value = {
    ...canvaAIChatMessages.value,
    [currentThreadId]: updatedMessages,
  };

  console.log(
    `[State] Updated CanvaAI message ${messageId} in thread ${currentThreadId}:`,
    updates,
  );
};

export const updateCanvaAIStreamingContent = (content: string): void => {
  canvaAICurrentStreamingContent.value = content;
};

export const finalizeCanvaAIStreaming = (): void => {
  const streamingContent = canvaAICurrentStreamingContent.value.trim();

  if (streamingContent) {
    addCanvaAIMessage({
      type: 'assistant',
      content: streamingContent,
      timestamp: new Date().toISOString(),
    });
  }

  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
};

export const getCanvaAIMessagesForCurrentThread = (): CanvaAIChatMessage[] => {
  const currentThreadId = threadId.value;
  if (!currentThreadId) return [];

  return canvaAIChatMessages.value[currentThreadId] || [];
};

export const clearCanvaAIHistoryForCurrentThread = (): void => {
  const currentThreadId = threadId.value;
  if (!currentThreadId) return;

  const updatedMessages = { ...canvaAIChatMessages.value };
  delete updatedMessages[currentThreadId];
  canvaAIChatMessages.value = updatedMessages;

  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;

  console.log(`[State] Cleared CanvaAI history for thread ${currentThreadId}`);
};

export const initializeCanvaAIForCurrentThread = (): void => {
  const currentThreadId = getOrCreateThreadId();

  if (!canvaAIChatMessages.value[currentThreadId]) {
    canvaAIChatMessages.value = {
      ...canvaAIChatMessages.value,
      [currentThreadId]: [
        {
          id: `init_${Date.now()}`,
          type: 'assistant',
          content:
            "👋 Hello! I'm powered by **@canva-ct/genai** - the AI toolkit behind this template.\n\n**What I can do:**\n🎙️ Text-to-Speech • 🎨 Image Generation • 🖼️ Image Analysis • 🎵 Audio Analysis • 🔧 Trigger UI Events • 🌐 Multimodal • ⚡ Streaming\n\n**Available Models:** Google (Gemini), Anthropic (Claude), OpenAI (GPT), Perplexity\n\n💬 Ask me about design workflows or @canva-ct/genai capabilities\n🎯 Generate images, analyze content, or trigger UI events\n\nWhat would you like to build today? **Happy Hacking!**",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

export const getCanvaAIHistoryDebugInfo = (): {
  totalThreads: number;
  currentThreadId: string | null;
  currentThreadMessageCount: number;
  allThreadIds: string[];
} => {
  const currentThread = threadId.value;
  const allThreads = Object.keys(canvaAIChatMessages.value);
  const currentThreadMessages = currentThread
    ? canvaAIChatMessages.value[currentThread]?.length || 0
    : 0;

  return {
    totalThreads: allThreads.length,
    currentThreadId: currentThread,
    currentThreadMessageCount: currentThreadMessages,
    allThreadIds: allThreads,
  };
};

export const clearAllCanvaAIHistory = (): void => {
  canvaAIChatMessages.value = {};
  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
  console.log('[State] Cleared all CanvaAI chat history');
};

// Function to stop streaming when changing contexts (called by streaming service)
export const stopStreamingForThreadChange = (): void => {
  isStreaming.value = false;
  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
  console.log('[State] Stopped streaming for thread change');
};

// Debug function to manually stop streaming if it gets stuck
export const forceStopStreaming = (): void => {
  isStreaming.value = false;
  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
  console.log('[State] Manually stopped streaming');
};

// Generate a new thread ID for agent sessions
export const generateThreadId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `canvas_thread_${timestamp}_${random}`;
};

// Initialize or get thread ID
export const getOrCreateThreadId = (): string => {
  if (!threadId.value) {
    threadId.value = generateThreadId();
  }
  return threadId.value;
};

// Reset thread (for new sessions)
export const resetThread = (): void => {
  threadId.value = generateThreadId();
  agentSessionActive.value = false;
  stopStreamingForThreadChange();
};

export const seed = signal(Math.random());
