import React from "react";

interface TableItemsListWrapperProps {
  children: React.ReactNode;
}

export default function TableItemsListWrapper({
  children,
}: TableItemsListWrapperProps) {
  return <div className="table-items-list-wrapper">{children}</div>;
}
