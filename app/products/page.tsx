"use client";
import { withApollo } from "@/apollo/withApollo";
import { Component } from "@/components/Charts/charts";
import Container from "@/components/Container";
import ProductSearch from "@/components/Product/ProductSearch";
import { useProductsQuery } from "@/gen/gql";
import React, { useEffect } from "react";

const page = () => {
  const { data, error, loading, refetch } = useProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

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
      <div id="mainbar-full" className="user-show-new">
        <div id="main-content">
          <div className="d-flex gs24 md:fd-column">
            <div className="flex--item fl-grow1">
              <ProductSearch data={data!} loading={loading} />
            </div>
            <div className="flex--item3 fl-shrink0 md:order-last mt0">
              <div className="d-grid">
                <Component data={data!} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default withApollo({ ssr: false })(page);
