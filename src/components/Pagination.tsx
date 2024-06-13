import { Cuisine } from "@/types";
import React, { SetStateAction, useEffect, useState } from "react";

type PaginationProps = {
  currentPage: number;
  cuisinePerPage: number;
  cuisines: Cuisine[];
  setCurrentPage:React.Dispatch<SetStateAction<number>>;
};

const Pagination = ({
  currentPage,
  cuisinePerPage,
  cuisines,
  setCurrentPage,
}: PaginationProps) => {
  let pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(cuisines.length / cuisinePerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {pageNumbers?.map((number, i) => {
          return (
            <div onClick={() =>setCurrentPage(number)} className={`cursor-pointer border-2 rounded-lg p-2 ${currentPage===number ? 'bg-black text-white' : ''}`} key={i}>
              {number}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pagination;
