import React, { useState, useEffect } from 'react';
import './style.css';

const PROGRESS_ITEMS = [
  'Set background',
  'Add shape',
  '2x Add text',
  'Insert page',
  'Add shape',
  '2x Add text',
  'Add shape',
  'Insert page',
  'Add shape',
  'Add text',
  '2x Add shape',
  '2x Add text',
  '2x Add shape',
  '2x Add text',
  '2x Add shape',
  '2x Add text',
  'Insert page',
  '2x Add text',
  'Add shape',
];

const TICK_DELAY_MS = 450;

const DesignProgressList: React.FC = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (completedCount >= PROGRESS_ITEMS.length) {
      setIsComplete(true);
      return;
    }
    const t = setTimeout(() => {
      setCompletedCount((c) => c + 1);
    }, TICK_DELAY_MS);
    return () => clearTimeout(t);
  }, [completedCount]);

  return (
    <div className="design-progress-list">
      {PROGRESS_ITEMS.map((label, index) => {
        const isCompleted = index < completedCount;
        const isInProgress = index === completedCount && !isComplete;
        return (
          <div
            key={index}
            className={`design-progress-item ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''}`}
          >
            <div className="design-progress-icon">
              {isCompleted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
                  <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              ) : isInProgress ? (
                <div className="design-progress-spinner" />
              ) : (
                <div className="design-progress-pending" />
              )}
            </div>
            <span className="design-progress-label">{label}</span>
          </div>
        );
      })}
      {!isComplete && (
        <div className="design-progress-loading">
          <span className="design-progress-dots">...</span>
        </div>
      )}
    </div>
  );
};

export default DesignProgressList;
