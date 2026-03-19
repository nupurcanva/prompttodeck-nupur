import React, { useState } from "react";
import type { MultipleChoiceComponentProps } from "@/components/SideNav/CanvaAIPanel/LLMUI/messages/types";

interface MultipleChoiceComponentPropsWithLoading extends MultipleChoiceComponentProps {
  loading?: boolean;
}

const MultipleChoiceComponent: React.FC<MultipleChoiceComponentPropsWithLoading> = ({
  context,
  placeholder,
  options,
  selectedOptions: initialSelectedOptions = [],
  isActive,
  onSubmit,
  loading = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<DropdownOption[]>(initialSelectedOptions);

  const handleOptionToggle = (option: DropdownOption) => {
    if (!isActive) return;

    setSelectedOptions(prev => {
      const isSelected = prev.some(selected => selected.value === option.value);

      if (isSelected) {
        // Remove option
        return prev.filter(selected => selected.value !== option.value);
      } else {
        // Add option
        return [...prev, option];
      }
    });
  };

  const handleSubmit = () => {
    if (isActive && selectedOptions.length > 0) {
      onSubmit(selectedOptions);
    }
  };

  const canSubmit = selectedOptions.length > 0;

  const handleSelectAll = () => {
    if (!isActive) return;
    setSelectedOptions(options);
  };

  const handleClearAll = () => {
    if (!isActive) return;
    setSelectedOptions([]);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex justify-start">
        <div className="flex items-start max-w-xs lg:max-w-md xl:max-w-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-2 flex items-center justify-center"></div>
          <div className="rounded-lg px-4 py-3 bg-gray-50 border border-gray-200 animate-pulse">
            <div className="mb-3">
              {/* Context title skeleton */}
              <div className="h-4 bg-gray-300 rounded-full w-48 mb-2"></div>
              {/* Placeholder text skeleton */}
              <div className="h-3 bg-gray-200 rounded-full w-32 mb-2"></div>
              {/* Selection counter skeleton */}
              <div className="h-3 bg-gray-200 rounded-full w-24 mb-2"></div>
            </div>

            {/* Options skeleton */}
            <div className="space-y-2 mb-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md flex items-start space-x-3"
                >
                  {/* Checkbox skeleton */}
                  <div className="flex-shrink-0 w-4 h-4 border border-gray-300 bg-gray-100 rounded mt-0.5"></div>
                  {/* Option content skeleton */}
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded-full w-24 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-32"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls skeleton */}
            <div className="space-y-2">
              {/* Bulk actions skeleton */}
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              {/* Submit button skeleton */}
              <div className="w-full h-8 bg-gray-300 rounded-md"></div>
            </div>

            {/* Timestamp skeleton */}
            <div className="h-2 bg-gray-200 rounded-full w-20 mt-2"></div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start max-w-xs lg:max-w-md xl:max-w-lg">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 mr-2 flex items-center justify-center text-sm">
          {isActive ? "📋" : "✅"}
        </div>
        <div
          className={`rounded-lg px-4 py-3 ${
            isActive ? "bg-purple-50 border border-purple-200" : "bg-gray-50 border border-gray-200"
          }`}
        >
          <div className="mb-3">
            <div
              className={`text-sm font-medium mb-2 ${isActive ? "text-gray-900" : "text-gray-600"}`}
            >
              {context || "Select multiple options:"}
            </div>
            {placeholder && (
              <div className={`text-xs mb-2 ${isActive ? "text-gray-500" : "text-gray-400"}`}>
                {placeholder}
              </div>
            )}

            {/* Selection counter and constraints info */}
            <div className={`text-xs mb-2 ${isActive ? "text-purple-600" : "text-gray-400"}`}>
              {isActive ? (
                <>
                  {selectedOptions.length} of {options.length} selected
                </>
              ) : (
                `${initialSelectedOptions.length} option${
                  initialSelectedOptions.length !== 1 ? "s" : ""
                } selected`
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="space-y-2 mb-3">
            {options.map((option, index) => {
              const isSelected = (isActive ? selectedOptions : initialSelectedOptions).some(
                selected => selected.value === option.value
              );

              return (
                <button
                  key={index}
                  onClick={() => handleOptionToggle(option)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors focus:outline-none flex items-start space-x-3 ${
                    isActive
                      ? isSelected
                        ? "bg-purple-100 border border-purple-300 hover:bg-purple-200 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                        : "bg-white border border-gray-200 hover:bg-purple-50 hover:border-purple-300 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      : isSelected
                        ? "bg-green-100 border border-green-300 cursor-default"
                        : "bg-gray-100 border border-gray-200 text-gray-500 cursor-default opacity-50"
                  }`}
                  disabled={!isActive}
                >
                  {/* Checkbox */}
                  <div
                    className={`flex-shrink-0 w-4 h-4 border rounded flex items-center justify-center mt-0.5 ${
                      isSelected
                        ? isActive
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-green-600 border-green-600 text-white"
                        : isActive
                          ? "border-gray-300 bg-white"
                          : "border-gray-300 bg-gray-100"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Option content */}
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        isActive ? "text-gray-900" : isSelected ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {option.label}
                    </div>
                    {option.description && (
                      <div
                        className={`text-xs mt-1 ${
                          isActive
                            ? "text-gray-600"
                            : isSelected
                              ? "text-gray-600"
                              : "text-gray-400"
                        }`}
                      >
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controls - only show when active */}
          {isActive && (
            <div className="space-y-2">
              {/* Bulk actions */}
              {options.length > 3 && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    disabled={selectedOptions.length === options.length}
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    disabled={selectedOptions.length === 0}
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  canSubmit
                    ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Selection{selectedOptions.length !== 1 ? "s" : ""} ({selectedOptions.length})
              </button>
            </div>
          )}

          <div className={`text-xs mt-2 ${isActive ? "text-gray-500" : "text-gray-400"}`}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceComponent;
