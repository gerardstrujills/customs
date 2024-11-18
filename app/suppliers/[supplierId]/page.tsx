"use client";
import { withApollo } from "@/apollo/withApollo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SupplierChart } from "@/components/Charts/SupplierChart";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import SupplierIntegralSearch from "@/components/Supplier/Integral/SupplierIntegralSearch";
import { useMeQuery, useSupplierQuery } from "@/gen/gql";
import useGetIntParam from "@/utils/useGetIntParam";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const page = ({}: Props) => {
  const intId = useGetIntParam("supplierId");

  const { data, error, loading, refetch } = useSupplierQuery({
    variables: {
      supplierId: intId,
    },
  });
  const { data: user, refetch: userFetch, error: userError } = useMeQuery();

  const router = useRouter();

  useEffect(() => {
    if (!loading && error) {
      if (error.message === "not authenticated") {
        router.push("/");
      }
    }

    if (!loading && userError) {
      if (userError.message === "not authenticated") {
        router.push("/");
      }
    }

    refetch();
    userFetch();
  }, [loading, error, userError, router, refetch, userFetch]);

  if (loading) {
    return (
      <Container user={user!} className="d-flex jc-center ai-center">
        <Loading />
      </Container>
    );
  }

  if (!loading && !data && !user) {
    return (
      <Container user={user!} className="d-flex jc-center ai-center">
        <Loading />
      </Container>
    );
  }

  if (!data?.supplier) {
    return <div>Supplier ID 404</div>;
  }

  return (
    <Container user={user!}>
      <div id="mainbar-full" className="user-show-new">
        <div id="main-content">
          <div className="d-flex gs24 md:fd-column">
            <div className="flex--item fl-grow1">
              <Header supplier={data.supplier} />

              <SupplierIntegralSearch user={user!} data={data} />
            </div>
            <div className="flex--item3 fl-shrink0 md:order-last mt0">
              <div className="d-grid">
                <SupplierChart data={data!} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default withApollo({ ssr: false })(page);
