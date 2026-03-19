import React, { useEffect, useRef, useCallback, useState } from 'react';
import UserMessage from '@/components/SideNav/CanvaAIPanel/LLMUI/messages/UserMessage';
import AssistantMessage from '@/components/SideNav/CanvaAIPanel/LLMUI/messages/AssistantMessage';
import NotificationMessage from '@/components/SideNav/CanvaAIPanel/LLMUI/messages/NotificationMessage';
import ImageGalleryMessage from '@/components/SideNav/CanvaAIPanel/LLMUI/messages/ImageGalleryMessage';
import SingleChoiceComponent from '@/components/SideNav/CanvaAIPanel/LLMUI/choices/SingleChoiceComponent';
import MultipleChoiceComponent from '@/components/SideNav/CanvaAIPanel/LLMUI/choices/MultipleChoiceComponent';
import DesignProgressList from '@/components/SideNav/CanvaAIPanel/DesignProgressList';

import Wonderbox, { WonderboxRef } from '@/components/Wonderbox/Wonderbox';
import canvaAIStreamingService from './services/canva-ai-stream';
import {
  isStreaming,
  getCanvaAIMessagesForCurrentThread,
  canvaAICurrentStreamingContent,
  initializeCanvaAIForCurrentThread,
  updateCanvaAIMessage,
  finalizeCanvaAIStreaming,
} from './state';
import type { CanvaAIChatMessage, DropdownOption } from './state';
import './style.css';

interface CanvaAIPanelProps {
  onClose: () => void;
}

const CanvaAIPanel: React.FC<CanvaAIPanelProps> = ({ onClose }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wonderboxRef = useRef<WonderboxRef>(null);
  const [isFromChatGPT, setIsFromChatGPT] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    try {
      const stored = localStorage.getItem('canva-from-chatgpt');
      setIsFromChatGPT(params.get('from') === 'chatgpt' && !!stored);
    } catch {
      setIsFromChatGPT(false);
    }
  }, []);

  // Get messages from global state
  const messages = getCanvaAIMessagesForCurrentThread();
  const currentStreamingContent = canvaAICurrentStreamingContent.value;

  // Memoize the update message function to prevent unnecessary re-renders
  const memoizedUpdateMessage = useCallback(updateCanvaAIMessage, []);

  // Initialize chat history for current thread
  useEffect(() => {
    initializeCanvaAIForCurrentThread();
  }, []);

  // Focus the input field when the panel opens
  useEffect(() => {
    // Use a small delay to ensure the component is fully rendered
    const focusTimeout = setTimeout(() => {
      if (wonderboxRef.current) {
        wonderboxRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(focusTimeout);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamingContent]);

  // Note: We don't stop streaming when panel unmounts -
  // streaming should continue and messages added to state

  // Canvas analysis using new streaming method
  const startCanvasAnalysis = async (message: string) => {
    try {
      await canvaAIStreamingService.startCanvaAIChatStream(message);
    } catch (error) {
      console.error('Failed to start canvas analysis:', error);
    }
  };

  const handleSubmit = async (value: string) => {
    if (!value.trim() || isStreaming.value) return;

    // Start canvas analysis (user message is added by the service)
    await startCanvasAnalysis(value);
  };

  const handleStop = () => {
    console.log('🛑 User requested to stop streaming');
    // First finalize any partial content to preserve it
    finalizeCanvaAIStreaming();
    // Then stop the stream
    canvaAIStreamingService.stopStream();
  };

  const renderMessage = (message: CanvaAIChatMessage, index: number) => {
    const messageProps = {
      id: message.id,
      type: message.type as any,
      content: message.content,
      timestamp: message.timestamp,
      isStreaming: message.isStreaming,
      comments: message.comments || [],
      canvasId: message.canvasId,
    };

    switch (message.type) {
      case 'user':
        return <UserMessage key={message.id} {...messageProps} />;

      case 'assistant':
        return <AssistantMessage key={message.id} {...messageProps} />;

      case 'single_choice':
        return (
          <SingleChoiceComponent
            key={message.id}
            id={message.id}
            context={message.context}
            placeholder={message.placeholder}
            options={message.options}
            selectedOption={message.selectedOption}
            isActive={!message.selectedOption} // Active until user makes a selection
            onSelect={(option: DropdownOption) => {
              console.log('Single choice selected:', option);
              // Send selection as new user message
              const selectionMessage = `I selected: ${option.label}`;
              handleSubmit(selectionMessage);
            }}
            timestamp={message.timestamp}
            loading={message.isLoading}
          />
        );

      case 'multiple_choice':
        return (
          <MultipleChoiceComponent
            key={message.id}
            id={message.id}
            context={message.context}
            placeholder={message.placeholder}
            options={message.options}
            selectedOptions={message.selectedOptions}
            isActive={!message.selectedOptions.length} // Active until user makes selections
            onSubmit={(selectedOptions: DropdownOption[]) => {
              console.log('Multiple choices selected:', selectedOptions);
              // Send selections as new user message
              const selections = selectedOptions.map(opt => opt.label).join(', ');
              const selectionMessage = `I selected: ${selections}`;
              handleSubmit(selectionMessage);
            }}
            timestamp={message.timestamp}
            loading={message.isLoading}
          />
        );

      case 'notification':
        if (index === messages.length - 1) {
          return <NotificationMessage key={message.id} {...messageProps} />;
        }
        return null;

      case 'image_gallery':
        return (
          <ImageGalleryMessage
            key={message.id}
            message={message}
            onImageClick={(url) => {
              console.log('Image selected:', url);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="canva-ai-panel">
      {/* Header */}
      <div className="bg-white p-4">
        <div className="flex gap-2">
          <div
            className="rounded-lg hover:bg-gray-100 p-1"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.90013 11.5035H18.4963C18.9105 11.5035 19.2463 11.8393 19.2463 12.2535C19.2463 12.6677 18.9105 13.0035 18.4963 13.0035H6.90013L11.2767 17.3801C11.5695 17.673 11.5695 18.1478 11.2767 18.4407C10.9838 18.7336 10.5089 18.7336 10.216 18.4407L5.26624 13.491C4.58283 12.8076 4.58283 11.6995 5.26624 11.0161L10.216 6.06635C10.5089 5.77346 10.9838 5.77346 11.2767 6.06635C11.5695 6.35924 11.5695 6.83412 11.2767 7.12701L6.90013 11.5035Z"
                fill="#0D1216"
                fillOpacity={0.86}
              />
            </svg>
          </div>
          <span className="text-sm text-gray-800 align-middle mt-1.5 mb-1.5">Canva design agent</span>
        </div>
      </div>

      {/* Scrollable content (chat or progress list) */}
      <div className="canva-ai-scrollable">
        {!isFromChatGPT && (
          <div className="canva-ai-chat">
            <div className="chat-messages">
              {messages.map((message, index) => renderMessage(message, index))}

              {/* Show streaming message */}
              {isStreaming.value && currentStreamingContent && (
                <AssistantMessage
                  id="streaming"
                  type="assistant"
                  content={currentStreamingContent}
                  timestamp={new Date().toISOString()}
                  isStreaming={true}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
        {isFromChatGPT && <DesignProgressList />}
      </div>

      {/* Input Section - sticky at bottom */}
      <div className="canva-ai-input canva-ai-input-sticky">
        <Wonderbox
          ref={wonderboxRef}
          placeholder={'Ask anything...'}
          onSubmit={handleSubmit}
          className="w-full"
          isStreaming={isStreaming.value}
          onStop={handleStop}
        />

        {/* Loading indicator */}
        {isStreaming.value && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
            Analyzing your canvas design...
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvaAIPanel;
