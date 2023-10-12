import React from "react";

interface TabButtonProps<T> {
  tab: T;
  activeTabState: [T, React.Dispatch<React.SetStateAction<T>>];
  onChangeTabFn: () => void;
}

export default function TabButton<T = unknown>({
  tab,
  onChangeTabFn,
  activeTabState,
}: TabButtonProps<T>) {
  const [activeTab, setActiveTab] = activeTabState;

  const handleOnSetActiveTab = (tab: T) => {
    setActiveTab(tab);
    onChangeTabFn();
  };

  return (
    <button
      className={`${
        activeTab === tab ? "primary-button" : "danger-button"
      } common-button upload-button-show-hide`}
      onClick={() => handleOnSetActiveTab(tab)}
    >
      {tab?.toString()}
    </button>
  );
}
