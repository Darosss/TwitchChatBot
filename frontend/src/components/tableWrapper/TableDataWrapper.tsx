import React from "react";

interface TableDataWrapperProps {
  children: React.ReactNode;
}

export default function TableDataWrapper({ children }: TableDataWrapperProps) {
  return <div className="table-data-wrapper">{children}</div>;
}
