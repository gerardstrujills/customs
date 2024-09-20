import { formatMonthAndDay } from "@/func/typeDate";
import { capitalizeWords } from "@/func/typeString";
import { useDeleteWithdrawalMutation } from "@/gen/gql";
import { gql, Reference } from "@apollo/client";
import React from "react";

type Withdrawal = {
  __typename?: "Withdrawal";
  id: number;
  title?: string | null;
  quantity: number;
  endTime: any;
  createdAt: any;
  updatedAt: any;
};

type Props = {
  withdrawal: Withdrawal[];
};

const ItemWithdrawalCard = ({ withdrawal }: Props) => {
  const [deleteWithdrawal] = useDeleteWithdrawalMutation();

  const handleDelete = (id: number) => {
    deleteWithdrawal({
      variables: { deleteWithdrawalId: id },
      update: (cache) => {
        cache.modify({
          fields: {
            products(ctx: readonly Reference[] = [], { readField }) {
              return ctx.map((productRef) => {
                const entries: readonly Reference[] =
                  readField("withdrawal", productRef) ?? [];

                const filtered = entries.filter(
                  (ref: Reference) => readField("id", ref) !== id
                );

                cache.writeFragment({
                  id: cache.identify(productRef),
                  fragment: gql`
                    fragment ProductWithdrawal on Product {
                      withdrawal
                    }
                  `,
                  data: {
                    withdrawal: filtered,
                  },
                });

                return productRef;
              });
            },
          },
        });
      },
    });
  };

  return (
    <div className="fl-grow1 ba bc-black-300 bar-md mt12 highlighted-post">
      {withdrawal.map((e, index) => {
        const isLast = index === withdrawal.length - 1;
        const classNames = isLast ? "p12" : "p12 bb bc-black-300";
        return (
          <div key={e.id} className={classNames}>
            <div className="d-flex ai-center jc-space-between fw-wrap">
              <div className="flex--item ws-nowrap">
                <div className="d-inline-block ws-normal">
                  <div className="topic-tag topic-tag-link">{e.title}</div>
                </div>
              </div>
              <div className="flex--item">
                <div className="d-flex gsx">
                  <div className="flex--item d-flex ai-center">
                    <div className="d-flex ws-normal gs4">
                      <div className="topic-tag topic-tag-link ml12">
                        Cantidad. {e.quantity}
                      </div>
                      <div className="d-flex gs4 gsx ai-center topic-tag topic-tag-link ml12">
                        <svg
                          aria-hidden="true"
                          className="svg-icon iconTack  d-block mx-auto"
                          width="15"
                          height="15"
                          viewBox="0 0 18 18"
                        >
                          <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"></path>
                        </svg>
                        <span className="flex--item">
                          <div className="gs4 gsx ai-center">
                            {capitalizeWords(
                              formatMonthAndDay({ createdAt: e.endTime })
                            )}
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="s-post-summary--meta mt4">
              <div className="d-flex">
                <div
                  onClick={() => handleDelete(e.id)}
                  className="s-link s-user-card--link d-flex gs4 ml4"
                >
                  <svg
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    className="svg-icon iconTack d-block mx-auto"
                  >
                    <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
                  </svg>
                  <div className="flex--item -link">Eliminar</div>
                </div>
                <div className="s-link s-user-card--link d-flex gs4 ml4">
                  <div className="s-user-card--link d-flex gs4 -link ml4">
                    <svg
                      aria-hidden="true"
                      height="16"
                      viewBox="0 0 16 16"
                      version="1.1"
                      width="16"
                      data-view-component="true"
                      className="svg-icon iconTack d-block mx-auto"
                    >
                      <path d="m.427 1.927 1.215 1.215a8.002 8.002 0 1 1-1.6 5.685.75.75 0 1 1 1.493-.154 6.5 6.5 0 1 0 1.18-4.458l1.358 1.358A.25.25 0 0 1 3.896 6H.25A.25.25 0 0 1 0 5.75V2.104a.25.25 0 0 1 .427-.177ZM7.75 4a.75.75 0 0 1 .75.75v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5A.75.75 0 0 1 7.75 4Z"></path>
                    </svg>
                    <div className="flex--item -link">Actualizar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemWithdrawalCard;
