import React from "react";

interface TableListWrapperProps {
  theadChildren: React.ReactNode;
  tbodyChildren: React.ReactNode;
}

export default function TableListWrapper({
  theadChildren,
  tbodyChildren,
}: TableListWrapperProps) {
  return (
    <div className="table-list-wrapper">
      <table className="table-list">
        <thead>{theadChildren}</thead>
        <tbody>{tbodyChildren}</tbody>
      </table>
    </div>
  );
}
