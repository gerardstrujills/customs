import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LeftSidebar: React.FC<{
  dataIsHereWhen?: boolean;
}> = ({ dataIsHereWhen }) => {
  const pathname = usePathname();

  return (
    <>
      <div
        id="left-sidebar"
        data-is-here-when={dataIsHereWhen ? "sm" : "md lg"}
        className="left-sidebar js-pinned-left-sidebar ps-relative"
      >
        <div className="left-sidebar--sticky-container js-sticky-leftnav">
          <nav role="navigation">
            <ol className="nav-links">
              <li
                className={`ps-relative ${
                  pathname.startsWith("/products") ? "youarehere" : ""
                }`}
                aria-current="false"
              >
                <Link href={"/products"} passHref legacyBehavior>
                  <a className="pl8 js-gps-track nav-links--link">
                    <div className="d-flex ai-center">
                      <div className="flex--item truncate">Productos</div>
                    </div>
                  </a>
                </Link>
              </li>

              <li>
                <ol className="nav-links">
                  <li className="fs-fine tt-uppercase ml8 mt16 mb4 fc-light">
                    Público
                  </li>

                  <li
                    className={`ps-relative ${
                      pathname.startsWith("/suppliers") ? "youarehere" : ""
                    }`}
                    aria-current={
                      pathname.startsWith("/suppliers") ? "true" : "false"
                    }
                  >
                    <Link href="/suppliers" passHref legacyBehavior>
                      <a
                        className={`js-gps-track nav-links--link${
                          pathname.startsWith("/suppliers") ? " active" : ""
                        }`}
                      >
                        <div className="d-flex ai-center">
                          <div className="flex--item truncate">Proveedores</div>
                        </div>
                      </a>
                    </Link>
                  </li>
                </ol>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
