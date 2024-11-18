import { capitalizeWords } from "@/func/typeString";
import { MeQuery, useDeleteSupplierMutation } from "@/gen/gql";
import { Reference, StoreObject } from "@apollo/client";
import Link from "next/link";
import React from "react";

type Suppliers = {
  id: number;
  name: string;
  ruc?: string | null;
  district?: string | null;
  province?: string | null;
  department?: string | null;
  productCount: number;
};

type Props = {
  user: MeQuery;
  pathname: string;
  suppliers: Suppliers[];
};

function SupplierCard({ pathname, suppliers, user }: Props) {
  const [deleteSupplier] = useDeleteSupplierMutation();
  const handleDelete = (id: number) => {
    deleteSupplier({
      variables: { id },
      update: (cache) => {
        cache.modify({
          fields: {
            suppliers(ctx = [], { readField }) {
              return ctx.filter(
                (ref: Reference | StoreObject | undefined) =>
                  id !== readField("id", ref)
              );
            },
          },
        });
      },
    });
  };

  const render = (data: Suppliers[]) => {
    return data.length === 0 ? (
      <div className="grid--item p8">
        <p>No se encontraron resultados.</p>
      </div>
    ) : (
      data.map((c) => (
        <div
          key={c.id}
          className="grid--item s-card bs-sm h:bs-md d-block mb8 p0 bg-black-050 h:bs-lg"
        >
          <div className="s-card h100 ps-relative b4 l4">
            <div className="grid--item ps-relative d-flex">
              <div className="s-post-summary--stats">
                <div className="s-post-summary--stats-item has-bounty">
                  <div className="d-flex">
                    <svg
                      aria-hidden="true"
                      className="svg-icon iconDocumentAlt"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                    >
                      <path d="M5 3a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm2 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 4.5c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5Zm.5 1.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1ZM5 14.5c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5Z"></path>
                      <path
                        d="M5.9 2h6.35A2.75 2.75 0 0 1 15 4.75v9.35c.62-.6 1-1.43 1-2.35v-7.5C16 2.45 14.54 1 12.75 1h-4.5c-.92 0-1.75.38-2.35 1Z"
                        opacity=".4"
                      ></path>
                    </svg>
                    <div className="flex__item">{c.productCount}</div>
                  </div>
                </div>
              </div>
              <div className="s-post-summary--content w100">
                <h4 className="flex--item v-truncate-companie">
                  <div className="s-link mb4">{c.ruc}</div>
                  <Link
                    passHref
                    legacyBehavior
                    href={`/suppliers/[supplierId]`}
                    as={`/suppliers/${c.id}`}
                  >
                    <a className="s-link s-post-summary--content-excerpt">
                      {c.name.toUpperCase()}
                    </a>
                  </Link>
                </h4>

                <div className="mt-auto d-flex jc-space-between fs-caption fc-black-400">
                  <div className="flex--item">
                    <span className="user-location d-block">
                      <div className="d-flex">
                        <svg
                          aria-hidden="true"
                          className="svg-icon iconLocation"
                          width="13"
                          height="14"
                          viewBox="0 0 17 18"
                        >
                          <path d="M2 6.38C2 9.91 8.1 17.7 8.1 17.7c.22.29.58.29.8 0 0 0 6.1-7.8 6.1-11.32A6.44 6.44 0 0 0 8.5 0 6.44 6.44 0 0 0 2 6.38Zm9.25.12a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0Z"></path>
                        </svg>
                        <div className="flex__item ml8">
                          {c.district !== null &&
                          c.district !== undefined &&
                          c.province !== null &&
                          c.province !== undefined
                            ? `${capitalizeWords(
                                c.district
                              )}, ${capitalizeWords(c.province)}`
                            : "No hay ubicación"}
                        </div>
                      </div>
                    </span>
                  </div>

                  {c.department !== null && c.department !== undefined && (
                    <div className="flex--item s-anchors s-anchors__inherit">
                      <span className="reputation-score">
                        {capitalizeWords(c.department)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="s-post-summary--meta mt4">
                  <div
                    className="s-user-card s-user-card__minimal"
                    aria-live="polite"
                  >
                    {c.productCount > 0 ? (
                      <>
                        <div className="s-user-card--info">
                          <ul className="s-user-card--awards">
                            <li className="s-user-card--rep">
                              <span
                                className="todo-no-class-here"
                                title="reputation score "
                                dir="ltr"
                              >
                                {c.productCount}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <time className="s-user-card--time">
                          <div className="s-link s-link__muted">Producto</div>
                        </time>
                      </>
                    ) : (
                      <div className="s-user-card--link d-flex gs4">
                        {user?.me?.isAccess && (
                          <div
                            className="flex--item s-link d-flex"
                            onClick={() => handleDelete(c.id)}
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
                            <div className="flex--item ml2 -link ta-center jc-center ai-center d-flex">
                              Eliminar
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    );
  };

  const sunat = suppliers?.filter((c) => c!.ruc?.length! > 0);

  const temporaries = suppliers?.filter((c) => c?.ruc === null);

  const pathMap: Record<string, JSX.Element | JSX.Element[]> = {
    sunat: render(sunat),
    temporary: render(temporaries),
    default: render(suppliers),
  };

  return pathMap[pathname] || pathMap.default;
}

export default SupplierCard;
