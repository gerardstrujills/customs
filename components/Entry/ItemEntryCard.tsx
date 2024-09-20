import { formatMonthAndDay } from "@/func/typeDate";
import { formatNumberWithCommas } from "@/func/typeNumber";
import React from "react";
import { capitalizeWords } from "@/func/typeString";

type Design = {
  isGrid: boolean;
  isFlex: boolean;
};

type Entry = {
  id: number;
  quantity: number;
  price: number;
  startTime: any;
  createdAt: any;
  updatedAt: any;
};

type Props = {
  entry: Entry[];
  design: Design;
};

function ItemDetailCard({ entry, design }: Props) {
  return (
    <>
      {entry.map((e) => {
        return (
          <div
            key={e.id}
            className={
              design.isGrid ?? design.isFlex
                ? "mt-auto d-grid jc-space-between fs-caption fc-black-400"
                : "mt-auto d-flex jc-space-between fs-caption fc-black-400"
            }
          >
            <ul className="list-reset s-anchors s-anchors__inherit d-flex fc-light gs8 mln4 fw-wrap fs-headline1">
              <li className="flex--item topic-tag topic-tag-link">
                <div className="d-flex gs4 gsx ai-center">
                  <div className="flex--item">
                    <svg
                      aria-hidden="true"
                      className="svg-icon iconTack  d-block mx-auto"
                      width="15"
                      height="15"
                      viewBox="0 0 18 18"
                    >
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                    </svg>{" "}
                  </div>
                  <span className="flex--item ">
                    <div className="gs4 gsx ai-center">
                      {capitalizeWords(
                        formatMonthAndDay({ createdAt: e.createdAt })
                      )}
                    </div>
                  </span>
                </div>
              </li>
              <li className="flex--item topic-tag topic-tag-link">
                <div className="d-flex gs4 gsx ai-center">
                  <div className="flex--item">
                    <svg
                      aria-hidden="true"
                      className="svg-icon iconTack  d-block mx-auto"
                      width="15"
                      height="15"
                      viewBox="0 0 18 18"
                    >
                      <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"></path>
                    </svg>{" "}
                  </div>
                  <span className="flex--item ">
                    <div className="gs4 gsx ai-center">
                      {capitalizeWords(
                        formatMonthAndDay({ createdAt: e.startTime })
                      )}
                    </div>
                  </span>
                </div>
              </li>
            </ul>
            <ul className="list-reset s-anchors s-anchors__inherit d-flex fc-light gs8 mln4 fw-wrap fs-headline1">
              <li className="flex--item topic-tag topic-tag-link">
                <div className="d-flex gs4 gsx ai-center">
                  <div className="flex--item">Precio S/.</div>
                  <span className="flex--item ">
                    <div className="gs4 gsx ai-center">
                      {formatNumberWithCommas({ number: e.price })}
                    </div>
                  </span>
                </div>
              </li>
              <li className="flex--item topic-tag topic-tag-link d-flex ai-center">
                <span className="flex--item">
                  <div className="gs4 gsx ai-center">Cantidad {e.quantity}</div>
                </span>
              </li>
            </ul>
          </div>
        );
      })}
    </>
  );
}

export default ItemDetailCard;
