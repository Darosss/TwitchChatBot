import React from "react";

export default function TableItemsListWrapper(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  return <div className="table-items-list-wrapper">{children}</div>;
}
