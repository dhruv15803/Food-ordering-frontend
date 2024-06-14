import React, { SetStateAction } from "react";

type PaginationProps = {
  noOfPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<SetStateAction<number>>;
};

const Pagination = ({
  noOfPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  let pages = [];
  for (let i = 1; i <= noOfPages; i++) {
    pages.push(i);
  }
  return (
    <>
      <div className="flex items-center my-2 p-2 justify-center gap-2">
        {pages.map((page, i) => {
          return (
            <div
              onClick={() => setCurrentPage(page)}
              className={`cursor-pointer border-2 rounded-lg p-2 ${
                currentPage === page ? "bg-black text-white" : ""
              }`}
              key={i}
            >
              {page}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pagination;
