import { SupplierQuery } from "@/gen/gql";
import { useActiveTab } from "@/hook/useActiveTab";
import Link from "next/link";
import React, { ChangeEvent, useMemo, useState } from "react";
import SupplierIntegralCard from "./SupplierIntegralCard";
import Doc from "@/doc/xls";

type Props = {
  data: SupplierQuery;
};

function SupplierIntegralSearch({ data }: Props) {
  const {
    id,
    name,
    ruc,
    district,
    province,
    department,
    productCount,
    createdAt,
    updatedAt,
    entry,
  } = data.supplier!;
  const [activeTab, handleTabChange] = useActiveTab(`/suppliers/${id}`, "news");

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filtered = useMemo(() => {
    return entry.filter(
      (item) =>
        item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.id.toString().includes(searchTerm)
    );
  }, [searchTerm, entry]);

  return (
    <>
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
              href={`/suppliers/${id}/?tab=news`}
              onClick={() => handleTabChange("news")}
              className={
                activeTab === "news"
                  ? "youarehere is-selected s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
                  : "s-btn s-btn__muted s-btn__outlined s-btn__sm d-flex uql-nav--expanded-item"
              }
            >
              <span className="s-badge s-badge__bounty s-badge__bounty s-badge__sm lh-xs mr4 px4 flex--item">
                {filtered.length}
              </span>
              <div className="flex--item">Productos</div>
            </Link>
          </div>
          {filtered.length > 0 && <Doc entry={filtered} />}
        </div>
      </div>
      <SupplierIntegralCard
        entry={filtered}
        pathname={activeTab}
        supplier={{
          id,
          name,
          ruc,
          district,
          province,
          department,
          productCount,
          createdAt,
          updatedAt,
        }}
      />
    </>
  );
}

export default SupplierIntegralSearch;
