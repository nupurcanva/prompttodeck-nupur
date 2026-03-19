import React from "react";
import type { SingleChoiceComponentProps } from "../messages/types";

interface SingleChoiceComponentPropsWithLoading extends SingleChoiceComponentProps {
  loading?: boolean;
}

const SingleChoiceComponent: React.FC<SingleChoiceComponentPropsWithLoading> = ({
  context,
  placeholder,
  options,
  selectedOption,
  isActive,
  onSelect,
  loading = false,
}) => {
  const handleOptionClick = (option: any) => {
    if (isActive) {
      onSelect(option);
    }
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
              <div className="h-4 bg-gray-300 rounded-full w-40 mb-2"></div>
              {/* Placeholder text skeleton */}
              <div className="h-3 bg-gray-200 rounded-full w-32 mb-2"></div>
            </div>

            {/* Options skeleton */}
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                >
                  {/* Option content skeleton */}
                  <div className="h-3 bg-gray-300 rounded-full w-28 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-36"></div>
                </div>
              ))}
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
          {isActive ? "🎯" : "✅"}
        </div>
        <div
          className={`rounded-lg px-4 py-3 ${
            isActive ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
          }`}
        >
          <div className="mb-3">
            <div
              className={`text-sm font-medium mb-2 ${isActive ? "text-gray-900" : "text-gray-600"}`}
            >
              {context || "Choose an option:"}
            </div>
            {placeholder && (
              <div className={`text-xs mb-2 ${isActive ? "text-gray-500" : "text-gray-400"}`}>
                {placeholder}
              </div>
            )}
          </div>

          {/* Show options when active, or all options grayed out when inactive */}
          <div className="space-y-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors focus:outline-none ${
                  isActive
                    ? "bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    : selectedOption?.value === option.value
                      ? "bg-green-100 border border-green-300 text-green-800 cursor-default"
                      : "bg-gray-100 border border-gray-200 text-gray-500 cursor-default opacity-50"
                }`}
                disabled={!isActive}
              >
                <div
                  className={`font-medium ${
                    isActive
                      ? "text-gray-900"
                      : selectedOption?.value === option.value
                        ? "text-green-800"
                        : "text-gray-500"
                  }`}
                >
                  {option.label}
                </div>
                {option.description && (
                  <div
                    className={`text-xs mt-1 ${
                      isActive
                        ? "text-gray-600"
                        : selectedOption?.value === option.value
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className={`text-xs mt-2 ${isActive ? "text-gray-500" : "text-gray-400"}`}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleChoiceComponent;
