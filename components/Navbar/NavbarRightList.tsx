import React from "react";

type NavbarRightListProps = {
  isSearchOpen: boolean;
  handleIsSearch: () => void;
};

const NavbarRightList: React.FC<NavbarRightListProps> = ({
  isSearchOpen,
  handleIsSearch,
}) => {
  return (
    <ol className="overflow-x-auto ml-auto -secondary d-flex ai-center list-reset h100 user-logged-in spacer-right">
      <li className="-item searchbar-trigger">
        <a
          className={`-link ${isSearchOpen ? "is-selected" : ""}`}
          role="button"
          aria-haspopup="true"
          aria-controls="search"
          onClick={handleIsSearch}
        >
          <svg
            aria-hidden="true"
            className="svg-icon iconSearch"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path d="m18 16.5-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path>
          </svg>
        </a>
      </li>
    </ol>
  );
};

export default NavbarRightList;
