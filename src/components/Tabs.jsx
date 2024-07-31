import React, { useState } from "react";

// css
import "../css/Tab.css";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <button
        key={index}
        className={`tab-button ${activeTab === index ? "active" : ""}`}
        onClick={() => handleTabClick(index)}
      >
        {tab.label}
      </button>
    ));
  };

  return (
    <div className="tabs-container">
      <div className="tab-buttons">{renderTabs()}</div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
