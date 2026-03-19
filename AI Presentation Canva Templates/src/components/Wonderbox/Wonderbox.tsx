import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import ArrowRightIcon from "@assets/icons/side-menu-icons/arrow-right.svg";
import PlusIcon from "@assets/icons/side-menu-icons/plus.svg";
import "./Wonderbox.css";

interface WonderboxProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  className?: string;
  isStreaming?: boolean;
  onStop?: () => void;
}

// Export the ref interface so parent components can use it
export interface WonderboxRef {
  focus: () => void;
}

const Wonderbox = forwardRef<WonderboxRef, WonderboxProps>(
  (
    { placeholder = "Describe your idea", onSubmit, className = "", isStreaming = false, onStop },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    }));

    const handleSubmit = () => {
      if (inputValue.trim()) {
        if (onSubmit) {
          onSubmit(inputValue.trim());
        }
        setInputValue("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };

    return (
      <div
        className={`wonderbox-container relative rounded-2xl p-4 flex flex-col gap-4 ${className}`}
        style={{
          border: "1px solid rgba(53, 71, 90, 0.20)",
          boxShadow:
            "rgba(0, 196, 204, 0.15) -7px -6px 16px 8px, rgb(139 61 255 / 20%) 6px 3px 15px 6px",
        }}
      >
        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="wonderbox-input w-full pl-1 pt-2 pb-4 text-sm border-none outline-none"
        />

        {/* Icons Row */}
        <div className="flex items-center justify-between">
          {/* Plus Icon */}
          <div className="wonderbox-icon-button flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer transition-colors">
            <img src={PlusIcon} alt="Plus" className="w-6 h-6" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Microphone Icon */}
            <div className="wonderbox-icon-button flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10.875 13.3496C11.282 13.2751 11.673 13.5447 11.748 13.9521C12.2 16.426 14.365 18.25 16.91 18.25C19.454 18.25 21.62 16.426 22.073 13.9531C22.147 13.5458 22.538 13.2754 22.945 13.3496C23.352 13.4241 23.623 13.8152 23.548 14.2227C23.011 17.159 20.599 19.38 17.66 19.706V21.25H21.16C21.574 21.25 21.91 21.586 21.91 22C21.91 22.414 21.574 22.75 21.16 22.75H12.66C12.246 22.75 11.91 22.414 11.91 22C11.91 21.586 12.246 21.25 12.66 21.25H16.16V19.706C13.22 19.379 10.809 17.158 10.272 14.2217C10.198 13.8142 10.467 13.4241 10.875 13.3496ZM16.91 3C19.119 3 20.91 4.7909 20.91 7V13C20.91 15.2091 19.119 17 16.91 17C14.701 17 12.91 15.2091 12.91 13V7C12.91 4.7909 14.701 3.0001 16.91 3ZM16.91 4.5C15.529 4.5001 14.41 5.6194 14.41 7V13C14.41 14.3806 15.529 15.4999 16.91 15.5C18.29 15.5 19.41 14.3807 19.41 13V7C19.41 5.6193 18.29 4.5 16.91 4.5Z"
                  fill="#0E1318"
                  transform="translate(-7, -3)"
                />
              </svg>
            </div>

            {/* Submit/Stop Button */}
            {isStreaming ? (
              <div
                className="wonderbox-action-button flex w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 cursor-pointer items-center justify-center"
                onClick={onStop}
                title="Stop streaming"
              >
                <div className="wonderbox-action-button flex gap-1">
                  <div className="wonderbox-action-button w-1 h-4 bg-white"></div>
                  <div className="wonderbox-action-button w-1 h-4 bg-white"></div>
                </div>
              </div>
            ) : (
              <div
                className={`wonderbox-action-button flex w-10 h-10 rounded-full items-center justify-center transition-colors ${
                  inputValue.trim().length > 0
                    ? "bg-violet-600 hover:bg-violet-700 cursor-pointer"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
                onClick={inputValue.trim().length > 0 ? handleSubmit : undefined}
              >
                <img
                  src={ArrowRightIcon}
                  alt="Submit"
                  className="w-6 h-6"
                  style={{
                    filter:
                      inputValue.trim().length > 0
                        ? "brightness(0) saturate(100%) invert(100%)"
                        : "brightness(0) saturate(100%) invert(60%)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Wonderbox.displayName = "Wonderbox";

export default Wonderbox;
