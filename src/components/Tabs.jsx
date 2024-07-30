import React, { useState } from "react";

// css
import "../css/Tab.css";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabOrder, setTabOrder] = useState(tabs.map((_, index) => index)); // Track the order of the tabs

  const handleTabClick = (index) => {
    const newTabOrder = [...tabOrder];
    newTabOrder.splice(newTabOrder.indexOf(index), 1);
    newTabOrder.unshift(index);
    setTabOrder(newTabOrder);
    setActiveTab(index);
  };

  const renderTabs = () => {
    return tabOrder.map((tabIndex, displayIndex) => (
      <button
        key={tabIndex}
        className={`tab-button ${activeTab === tabIndex ? "active" : ""}`}
        onClick={() => handleTabClick(tabIndex)}
        style={{ order: displayIndex }}
      >
        {tabs[tabIndex].label}
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
