import React from "react";

const PaginationSection = ({ setPage, page, listings }) => {
  const currentPage = (page - 1) * 10;
  const currentListings = listings.slice(currentPage, currentPage + 10);
  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul>
        <li className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Poprzednia
            </button>
          </li>
          <li className="page-item">
            <span className="page-link">{page}</span>
          </li>
          <li
            className={`page-item ${currentListings.length < 10 ? "disabled" : ""}`}
          >
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Następna
            </button>
          </li>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationSection;
