import React from "react";

export default function TableDataWrapper(props: { children: React.ReactNode }) {
  const { children } = props;

  return <div className="table-data-wrapper">{children}</div>;
}
