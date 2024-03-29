import React, { useEffect, useState } from "react";

import { usePagination, DOTS, useLocalStorage } from "@hooks";
import classnames from "classnames";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  localStorageName: string;
  className: string;
}

export default function Pagination({
  totalCount,
  siblingCount,
  currentPage,
  localStorageName,
  className,
}: PaginationProps) {
  const [, setSearchParams] = useSearchParams();

  const [pageSizeT, setPageSize] = useLocalStorage<number>(
    localStorageName,
    15
  );
  const [currentPageLoc, setCurrentPageLoc] = useState<number>(currentPage);

  const onPageChangeSearchParam = (value: string) => {
    setSearchParams((prevState) => {
      prevState.set("page", value);
      return prevState;
    });
  };

  useEffect(() => {
    setSearchParams((prevState) => {
      prevState.set("limit", String(pageSizeT));
      return prevState;
    });
    // Unnecessary rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSizeT]);

  useEffect(() => {
    const checkIfPageIsTooBigAndSet = () => {
      if (!paginationRange) return;

      if (currentPageLoc - 1 > paginationRange.length) {
        setCurrentPageLoc(Number(paginationRange[paginationRange.length - 1]));
      }
    };

    checkIfPageIsTooBigAndSet();
    setSearchParams((prevState) => {
      prevState.set("page", String(currentPageLoc));
      return prevState;
    });
    // Unnecessary rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageLoc]);

  const paginationRange = usePagination(
    totalCount,
    pageSizeT,
    siblingCount,
    currentPage
  );

  const PageSizeSelect = () => {
    return (
      <select
        name="page-size"
        className="page-size common-button primary-button"
        value={pageSizeT}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        <option value={pageSizeT}>{pageSizeT}</option>
        <option value={5}>5</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={500}>500</option>
      </select>
    );
  };

  const TotalResults = () => {
    return (
      <div className="total-count">
        Results: <span>{totalCount}</span>
      </div>
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
      <>
        <TotalResults />
        <div className="page-size-single">
          <label>Page size</label>
          <PageSizeSelect />
        </div>
      </>
    );
  }

  const onNext = () => {
    onPageChangeSearchParam(String(currentPage + 1));
  };

  const onPrevious = () => {
    onPageChangeSearchParam(String(currentPage - 1));
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
          onClick={() => (currentPage > 1 ? onPrevious() : "")}
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
              key={index}
              className={classnames("pagination-item", {
                selected: pageNumber === currentPage,
              })}
              onClick={() => {
                onPageChangeSearchParam(String(pageNumber));
              }}
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
          onClick={() => (currentPage < Number(lastPage) ? onNext() : "")}
        >
          <div className="arrow right" />
        </li>
        <PageSizeSelect />
        <TotalResults />
      </ul>
    </>
  );
}
