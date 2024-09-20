import { Product, ProductsQuery } from "@/gen/gql";
import { useActiveTab } from "@/hook/useActiveTab";
import Link from "next/link";
import React, { ChangeEvent, useMemo, useState } from "react";
import Loading from "../Loading";
import ProductCard from "./ProductCard";
import DocEntries from "@/doc/DocEntry";
import ProductCreate from "./ProductCreate";
import {
  filterProductsByEntry,
  getFilteredAndSortedProducts,
  sortByCreatedAtDesc,
} from "@/func/product/productType";

type Props = {
  loading: boolean;
  data: ProductsQuery;
};

function ProductSearch({ data, loading }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, handleTabChange] = useActiveTab(`/products`, "all");

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filtered = useMemo(() => {
    if (!data?.products) return [];

    const search = searchTerm.toLowerCase();

    return data.products
      .map((item) => {
        const filteredEntries = item.entry.filter((entry) =>
          entry.supplier.name.toLowerCase().includes(search)
        );

        const matchesProductFields =
          item.title.toLowerCase().includes(search) ||
          item.id.toString().includes(search) ||
          item.unitOfMeasurement.toLowerCase().includes(search) ||
          item.materialType.toLowerCase().includes(search);

        if (filteredEntries.length === 0 && !matchesProductFields) {
          return null;
        }

        return {
          ...item,
          entry: filteredEntries.length > 0 ? filteredEntries : item.entry,
        };
      })
      .filter((item): item is Product => item !== null);
  }, [searchTerm, data?.products]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="ps-relative mb16">
        <div className="flex--item mb12 fs-title2 lh-xs">Productos</div>
        <p className="fs-body1 fc-black-500">
          En esta sección, encontrarás todo lo que necesitas para iniciar la
          producción de tus productos.
          <br /> Te brindamos la información clave para que tengas éxito en tu
          almacen
        </p>
        <div className="ps-absolute t0 r0 d-flex gs6 fw-wrap">
          <div
            onClick={() => setOpenModal(true)}
            className="d-flex s-btn s-btn__primary p4"
          >
            <svg
              aria-hidden="true"
              className="svg-icon iconPencil mr2"
              width="14"
              height="14"
              viewBox="0 0 15 15"
            >
              <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
            </svg>
            <div className="flex__item">Crear</div>
          </div>
        </div>
        <ProductCreate
          handleClose={() => setOpenModal(false)}
          isOpen={openModal}
        />
      </div>
      <div className="d-flex ai-end jc-space-between fw-wrap gs8 mb16">
        <div className="flex--item ps-relative">
          <input
            className="s-input s-input__search h100 wmx3"
            placeholder="Buscar producto"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            aria-hidden="true"
            className="s-input-icon s-input-icon__search svg-icon iconSearch"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path d="m18 16.5-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5ZM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0Z"></path>
          </svg>
        </div>
        <div className="d-flex jc-end gs8">
          <div className="s-btn-group flex--item ff-row-nowrap">
            <Link
              href={`/products/?tab=all`}
              onClick={() => handleTabChange("all")}
              className={
                activeTab === "all"
                  ? "youarehere is-selected s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
                  : "s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
              }
            >
              <span className="s-badge s-badge__bounty s-badge__bounty s-badge__sm lh-xs mr4 px4 flex--item">
                {getFilteredAndSortedProducts({ data: filtered! }).length}
              </span>
              <div className="flex--item">Productos</div>
            </Link>
            <Link
              href={`/products/?tab=news`}
              onClick={() => handleTabChange("news")}
              className={
                activeTab === "news"
                  ? "youarehere is-selected s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
                  : "s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
              }
            >
              <span className="s-badge s-badge__bounty s-badge__bounty s-badge__sm lh-xs mr4 px4 flex--item">
                {filterProductsByEntry({ data: filtered! }).length}
              </span>
              <div className="flex--item">Entrada</div>
            </Link>
            <Link
              href={`/products/?tab=valid`}
              onClick={() => handleTabChange("valid")}
              className={
                activeTab === "valid"
                  ? "youarehere is-selected s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
                  : "s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
              }
            >
              <span className="s-badge s-badge__bounty s-badge__bounty s-badge__sm lh-xs mr4 px4 flex--item">
                {filtered?.reduce((total, product) => {
                  return total + product.withdrawal.length;
                }, 0) ?? 0}
              </span>
              <div className="flex--item">Salida</div>
            </Link>
          </div>
          {filtered!.length! > 0 && (
            <DocEntries data={filtered!} tab={activeTab} />
          )}
        </div>
      </div>
      <ProductCard
        data={sortByCreatedAtDesc({ data: filtered! })!}
        pathname={activeTab}
      />
    </>
  );
}

export default ProductSearch;
