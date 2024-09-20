import React from "react";
import Link from "next/link";

type ProductsPopoverProps = {
  isPopoverOpen: boolean;
  popoverPosition: { x: number; y: number };
};

const ProductsPopover: React.FC<ProductsPopoverProps> = ({
  isPopoverOpen,
  popoverPosition,
}) => {
  return (
    <div
      className={`s-popover ws2  p0 ${isPopoverOpen ? "is-visible mt8" : ""}`}
      id="products-popover"
      role="menu"
      aria-hidden={!isPopoverOpen}
      style={
        isPopoverOpen
          ? {
              position: "fixed",
              top: popoverPosition.y,
              left: popoverPosition.x,
            }
          : {}
      }
      data-popper-placement="bottom"
    >
      <div className="s-popover--arrow"></div>
      <ol className="list-reset s-anchors s-anchors__inherit">
        {/* {items.map((item, index) => (
          <li className="m6" key={index}>
            <Link href={"/[itemId]"} as={`/${item.id}`} passHref legacyBehavior>
              <a className="bar-sm p6 d-block h:bg-black-100 js-gps-track">
                <span className="fs-body1 d-block">{item.title}</span>
                <span className="fs-caption d-block fc-light">
                  {item.shortformDescription}
                </span>
              </a>
            </Link>
          </li>
        ))} */}
      </ol>
    </div>
  );
};
export default ProductsPopover;
