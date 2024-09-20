import NavbarRightList from "./NavbarRightList";
import React, { useEffect, useMemo, useState } from "react";
import ProductsPopover from "./ProductsPopover";
import LeftSidebar from "../LeftSidebar";
import Link from "next/link";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleIsSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const handlePopoverToggle: React.MouseEventHandler<HTMLAnchorElement> = (
    event
  ) => {
    event.preventDefault();
    setIsPopoverOpen(!isPopoverOpen);
  };

  const centerPopoverOnFirstOpen = () => {
    if (isPopoverOpen) {
      const buttonElement = document.querySelector(".js-products-menu");
      const popoverElement = document.getElementById("products-popover");
      if (buttonElement && popoverElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const popoverRect = popoverElement.getBoundingClientRect();

        const popoverX =
          buttonRect.left + (buttonRect.width - popoverRect.width) / 2;
        const popoverY = buttonRect.bottom;

        popoverElement.style.transform = "translateX(-50%)";

        setPopoverPosition({ x: popoverX, y: popoverY });
      }
    }
  };

  useMemo(() => {
    centerPopoverOnFirstOpen();
  }, [isPopoverOpen]);

  const handleClickOutsidePopover = (event: Event) => {
    const popoverElement = document.getElementById("products-popover");
    if (
      popoverElement &&
      !popoverElement.contains(event.target as Node) &&
      event.target !== document.querySelector(".js-products-menu")
    ) {
      setIsPopoverOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsidePopover);

    const updatePopoverPosition = () => {
      const buttonElement = document.querySelector(".js-products-menu");
      const popoverElement = document.getElementById("products-popover");
      if (buttonElement && popoverElement && isPopoverOpen) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const popoverRect = popoverElement.getBoundingClientRect();

        const popoverX =
          buttonRect.left + (buttonRect.width - popoverRect.width) / 2;
        const popoverY = buttonRect.bottom;
        popoverElement.style.transform = "translateX(0%)";

        setPopoverPosition({ x: popoverX, y: popoverY });
      }
    };

    window.addEventListener("resize", updatePopoverPosition);

    return () => {
      document.removeEventListener("click", handleClickOutsidePopover);
      window.removeEventListener("resize", updatePopoverPosition);
    };
  }, [isPopoverOpen]);

  const [openLeftSidebarToggle, setOpenLeftSidebarToggle] = useState(false);

  const toggleLeftSidebar = () => {
    setOpenLeftSidebarToggle(!openLeftSidebarToggle);
  };

  return (
    <header className="top-bar ps-absolute t0 l0 top-bar__network">
      <div className="wmx12 mx-auto d-flex ai-center h100" role="menubar">
        <div className="-main flex--item">
          <div
            className={
              openLeftSidebarToggle
                ? "left-sidebar-toggle p0 ai-center jc-center topbar-icon-on"
                : "left-sidebar-toggle p0 ai-center jc-center"
            }
            onClick={toggleLeftSidebar}
          >
            <span className="ps-relative"></span>
          </div>
          <div
            className="topbar-dialog leftnav-dialog js-leftnav-dialog dno mb50"
            style={{
              display: openLeftSidebarToggle ? "block" : "none",
              top: openLeftSidebarToggle ? "50px" : "0",
            }}
          >
            <LeftSidebar dataIsHereWhen />
          </div>

          <Link href={"/"} passHref legacyBehavior>
            <a className="-logo">
              <span className="">Santasa</span>
            </a>
          </Link>

          <ol className="s-navigation" role="presentation">
            <li>
              <a
                href="#"
                className={`s-navigation--item js-products-menu ${
                  isPopoverOpen ? "is-selected" : ""
                }`}
                aria-controls="products-popover"
                onClick={handlePopoverToggle}
              >
                Productos
              </a>
            </li>
          </ol>
          <ProductsPopover
            isPopoverOpen={isPopoverOpen}
            popoverPosition={popoverPosition}
          />
        </div>
        <form
          id="search"
          role="search"
          className={`flex--item fl-grow1 searchbar px12 ${
            isSearchOpen ? "searchbar__open" : ""
          }`}
          autoComplete="off"
        >
          <div className="ps-relative">
            <input
              type="text"
              placeholder="Buscar..."
              maxLength={240}
              className="s-input s-input__search"
              aria-label="Búsqueda"
              aria-controls="top-search"
              data-controller="s-popover"
              data-action="focus->s-popover#show"
              data-s-popover-placement="bottom-start"
            />
            <svg
              aria-hidden="true"
              className="s-input-icon s-input-icon__search svg-icon iconSearch"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path d="m18 16.5-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path>
            </svg>
          </div>
        </form>
        <NavbarRightList
          isSearchOpen={isSearchOpen}
          handleIsSearch={handleIsSearch}
        />
      </div>
    </header>
  );
};

export default Navbar;
