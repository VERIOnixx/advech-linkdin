import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs">
      <ul>
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={index === activeTab ? "active" : ""}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
