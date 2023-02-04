import "./style.css";
import React from "react";
import usePagination, { DOTS } from "@hooks/usePagination.hook";
import classnames from "classnames";

export default function Pagination(props: {
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  localStorageName?: string;
  className: string;
}) {
  const {
    onPageChange,
    onPageSizeChange,
    totalCount,
    siblingCount,
    currentPage,
    pageSize,
    localStorageName,
    className,
  } = props;

  const paginationRange = usePagination(
    totalCount,
    pageSize,
    siblingCount,
    currentPage
  );

  const PageSizeSelect = () => {
    return (
      <select
        name="page-size"
        id="page-size"
        defaultValue={pageSize}
        onChange={(e) => {
          onPageSizeChange(Number(e.target.value));
          localStorageName
            ? localStorage.setItem(localStorageName, e.target.value)
            : null;
        }}
      >
        <option value={pageSize}>{pageSize}</option>
        <option value="5">5</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="500">500</option>
      </select>
    );
  };

  // If no range = return;
  if (!paginationRange) {
    return (
      <>
        Page size
        <PageSizeSelect />
      </>
    );
  }

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return (
      <div className="page-size-alone">
        <label>Page size</label>
        <PageSizeSelect />
      </div>
    );
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
          onClick={() => {
            currentPage > 1 ? onPrevious() : "";
          }}
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
          onClick={() => {
            currentPage < lastPage ? onNext() : "";
          }}
        >
          <div className="arrow right" />
        </li>
        <PageSizeSelect />
      </ul>
    </>
  );
}
