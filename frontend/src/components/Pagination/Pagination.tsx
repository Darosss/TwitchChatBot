import "./style.css";
import React from "react";
import usePagination, { DOTS } from "../../hooks/usePagination.hook";
import classnames from "classnames";

export default function Pagination(props: {
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  className: string;
}) {
  const {
    onPageChange,
    onPageSizeChange,
    totalCount,
    siblingCount,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange = usePagination(
    totalCount,
    pageSize,
    siblingCount,
    currentPage
  );

  // If no range = return;
  if (!paginationRange) {
    return <></>;
  }

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return <></>;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <>
      <ul
        className={classnames("pagination-container", {
          [className]: className,
        })}
      >
        {/* Left navigation arrow */}
        <li
          className={classnames("pagination-item", {
            disabled: currentPage === 1,
          })}
          onClick={onPrevious}
        >
          <div className="arrow left" />
        </li>
        {paginationRange.map((pageNumber, index) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === DOTS) {
            return (
              <li key={pageNumber + index} className="pagination-item dots">
                &#8230;
              </li>
            );
          }
          // Render our Page Pills
          return (
            <li
              key={pageNumber}
              className={classnames("pagination-item", {
                selected: pageNumber === currentPage,
              })}
              onClick={() => onPageChange(pageNumber as number)}
            >
              {pageNumber}
            </li>
          );
        })}

        {/*  Right Navigation arrow */}
        <li
          className={classnames("pagination-item", {
            disabled: currentPage === lastPage,
          })}
          onClick={onNext}
        >
          <div className="arrow right" />
        </li>
        <select
          name="pageSize"
          id="pageSize"
          defaultValue={20}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </ul>
    </>
  );
}
