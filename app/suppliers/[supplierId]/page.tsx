"use client";
import { withApollo } from "@/apollo/withApollo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SupplierChart } from "@/components/Charts/SupplierChart";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import SupplierIntegralSearch from "@/components/Supplier/Integral/SupplierIntegralSearch";
import { useSupplierQuery } from "@/gen/gql";
import useGetIntParam from "@/utils/useGetIntParam";
import Link from "next/link";
import React, { useEffect } from "react";

type Props = {};

const page = ({}: Props) => {
  const intId = useGetIntParam("supplierId");

  const { data, error, loading, refetch } = useSupplierQuery({
    variables: {
      supplierId: intId,
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <Container className="d-flex jc-center ai-center">
        <Loading />
      </Container>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.supplier) {
    return <div>Supplier ID 404</div>;
  }

  return (
    <Container>
      <div id="mainbar-full" className="user-show-new">
        <div id="main-content">
          <div className="d-flex gs24 md:fd-column">
            <div className="flex--item fl-grow1">
              <Breadcrumbs
                items={[
                  { text: "Santasa", link: "/" },
                  { text: "Corporaciones", link: "/suppliers" },
                ]}
              />

              <Header supplier={data.supplier} />

              <SupplierIntegralSearch data={data} />
            </div>
            <div className="flex--item3 fl-shrink0 md:order-last mt0">
              <div className="d-grid">
              <SupplierChart data={data!}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default withApollo({ ssr: false })(page);
