import "./style.css";
import React from "react";

export default function TableListWrapper(props: {
  theadChildren: React.ReactNode;
  tbodyChildren: React.ReactNode;
}) {
  const { theadChildren, tbodyChildren } = props;

  return (
    <div className="table-list-wrapper">
      <table className="table-list">
        <thead>{theadChildren}</thead>
        <tbody>{tbodyChildren}</tbody>
      </table>
    </div>
  );
}
