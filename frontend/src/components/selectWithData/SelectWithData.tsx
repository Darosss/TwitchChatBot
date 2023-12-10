import { usePagination } from "@hooks";
import React, { ChangeEvent, useState } from "react";
interface SelectWithDataProps<T> {
  title: string;
  data: T[];
  defaultValue: HTMLSelectElement["value"];
  nameKey: keyof T;
  valueKey: keyof T;
  idKey?: keyof T;
  onChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  searchName: string;
  onChangeSearchName: (name: string) => void;
  paginationData?: SelectPaginationProps;
}

export default function SelectWithData<T>({
  title,
  data,
  defaultValue,
  nameKey,
  valueKey,
  idKey,
  searchName,
  onChangeSelect,
  onChangeSearchName,
  paginationData,
}: SelectWithDataProps<T>) {
  const [searchNameLocal, setSearchNameLocal] = useState(searchName);
  return (
    <div className="select-with-data-wrapper">
      <div>{title}</div>
      <div className="select-with-data-search">
        <label>Search </label>
        <input
          type="search"
          value={searchNameLocal}
          onChange={(e) => setSearchNameLocal(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" ? onChangeSearchName(searchNameLocal) : null
          }
        />
      </div>
      <select value={defaultValue} onChange={onChangeSelect}>
        {data.map((value, index) => (
          <CustomSelectOption
            key={idKey ? String(value[idKey]) : index}
            name={String(value[nameKey])}
            value={String(value[valueKey])}
          />
        ))}
      </select>
      {paginationData ? <SelectPagination {...paginationData} /> : null}
    </div>
  );
}

interface CustomSelectOptionProps {
  name: string;
  value: HTMLOptionElement["value"];
}
function CustomSelectOption({ name, value }: CustomSelectOptionProps) {
  return <option value={value}>{name}</option>;
}

interface SelectPaginationProps {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onChangePagination: (page: number, size: number) => void;
}

function SelectPagination({
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onChangePagination,
}: SelectPaginationProps) {
  const [pageSizeLocal, setPageSizeLocal] = useState(pageSize);
  const [page, setPage] = useState(currentPage);
  const paginationRange = usePagination(totalCount, pageSize, 1, currentPage);
  return (
    <div className="select-pagination-wrapper">
      <div className="select-pagination-pages">
        {paginationRange?.map((val, index) => (
          <button
            key={index}
            className={`common-button ${
              val === page ? "primary-button" : "secondary-button"
            }  `}
            onClick={() => {
              const valAsNumber = Number(val);
              if (!isNaN(valAsNumber)) {
                setPage(valAsNumber);
                onChangePagination(valAsNumber, pageSize);
              }
            }}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="select-pagination-page-size">
        <label>Page size </label>
        <input
          type="number"
          value={pageSizeLocal}
          onChange={(e) => {
            let value = e.target.valueAsNumber;
            if (isNaN(value) || value <= 0) value = 1;
            setPageSizeLocal(value);
          }}
          onBlur={() => onChangePagination(page, pageSizeLocal)}
          min={1}
        />
      </div>
    </div>
  );
}
