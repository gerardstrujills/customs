"use client";
import { withApollo } from "@/apollo/withApollo";
import Container from "@/components/Container";
import SupplierCreate from "@/components/Supplier/SupplierCreate";
import SupplierSearch from "@/components/Supplier/SupplierSearch";
import { useSuppliersQuery } from "@/gen/gql";
import React, { useEffect, useState } from "react";

type SuppliersPageProps = {};

const SuppliersPage: React.FC<SuppliersPageProps> = () => {
  const { data, error, loading, refetch } = useSuppliersQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [openModal, setOpenModal] = useState(false);

  if (!loading && !data) {
    return (
      <>
        <div>Tu consulta falló por alguna razón Suppliers</div>
        <div>{error?.message}</div>
      </>
    );
  }

  return (
    <Container>
      <div id="mainbar-full">
        <div className="d-flex mb24">
          <div className="flex--item fl1">
            <h1 className="fs-headline mb0">Departamento de Proveedores</h1>
            <p className="fs-body1 fc-light fl-grow1 mb0">
              Todos los proveedores
            </p>
          </div>
          <div className="ml12 aside-cta flex--item print:d-none">
            <button
              onClick={() => setOpenModal(true)}
              className="ws-nowrap s-btn s-btn__primary s-btn__sm d-flex p6"
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
              <div className="flex__item">Crear Proveedor</div>
            </button>
          </div>
        </div>

        <SupplierCreate
          handleClose={() => setOpenModal(false)}
          isOpen={openModal}
        />

        <SupplierSearch data={data!} loading={loading} />
      </div>
    </Container>
  );
};
export default withApollo({ ssr: false })(SuppliersPage);
