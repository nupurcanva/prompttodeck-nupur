import React from "react";
import styles from "./BasicTabs.module.css";

export interface TabItem {
  id: string;
  name: string;
}

interface BasicTabsProps {
  tabs: TabItem[];
  activeTab?: number;
  onTabChange?: (tabIndex: number, tab: TabItem) => void;
  className?: string;
}

const BasicTabs: React.FC<BasicTabsProps> = ({
  tabs,
  activeTab = 0,
  onTabChange,
  className = "",
}) => {
  const handleTabClick = (index: number) => {
    if (onTabChange) {
      onTabChange(index, tabs[index]);
    }
  };

  return (
    <div className={`${styles.basicTabsContainer} ${className}`}>
      <div className={styles.basicTabsPills}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`${styles.basicTabPill} ${activeTab === index ? styles.active : ""}`}
            onClick={() => handleTabClick(index)}
            aria-label={tab.name}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div
        className={styles.basicTabsIndicator}
        style={{
          left: `${(activeTab / tabs.length) * 100}%`,
          width: `${(1 / tabs.length) * 100}%`,
        }}
      />
    </div>
  );
};

export default BasicTabs;
