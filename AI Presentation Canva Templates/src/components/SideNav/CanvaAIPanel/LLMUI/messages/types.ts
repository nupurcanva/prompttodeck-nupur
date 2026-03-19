// Dropdown option interface
export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

// Message base interface
export interface BaseMessage {
  id: string;
  timestamp: string;
  isActive?: boolean; // Only last message can be active
}

// Different message types
export interface UserMessageData extends BaseMessage {
  type: "user";
  content: string;
}

export interface AssistantMessageData extends BaseMessage {
  type: "assistant";
  content: string;
  isStreaming?: boolean;
}

export interface SingleChoiceMessageData extends BaseMessage {
  type: "single_choice";
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOption?: DropdownOption;
  isLoading?: boolean;
}

export interface MultipleChoiceMessageData extends BaseMessage {
  type: "multiple_choice";
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOptions?: DropdownOption[];
  isLoading?: boolean;
}

export interface CommentMessageData extends BaseMessage {
  type: "comments";
  content: string;
  comments: Comment[]; // You may need to import `Comment` type here
  canvasId?: string;
}

export interface NotificationMessageData extends BaseMessage {
  type: "notification";
  content: string;
}

export interface ImageGalleryMessageData extends BaseMessage {
  type: "image_gallery";
  images: string[];
  isLoading?: boolean;
  loadingCount?: number;
}

export type ChatMessage =
  | UserMessageData
  | AssistantMessageData
  | SingleChoiceMessageData
  | MultipleChoiceMessageData
  | CommentMessageData
  | NotificationMessageData
  | ImageGalleryMessageData;

// Props interfaces for components
export interface SingleChoiceComponentProps {
  id: string;
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOption?: DropdownOption;
  isActive: boolean;
  onSelect: (option: DropdownOption) => void;
  timestamp: string;
}

export interface MultipleChoiceComponentProps {
  id: string;
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOptions?: DropdownOption[];
  isActive: boolean;
  onSubmit: (selectedOptions: DropdownOption[]) => void;
  timestamp: string;
}
