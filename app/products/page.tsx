"use client";
import { withApollo } from "@/apollo/withApollo";
import { Component } from "@/components/Charts/charts";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import ProductSearch from "@/components/Product/ProductSearch";
import { useMeQuery, useProductsQuery } from "@/gen/gql";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { data, error: productError, loading, refetch } = useProductsQuery();
  const { data: user, refetch: userFetch, error: userError } = useMeQuery();

  const router = useRouter();

  useEffect(() => {
    if (!loading && productError) {
      if (productError.message === "not authenticated") {
        router.push("/");
      }
    }

    if (!loading && userError) {
      if (userError.message === "not authenticated") {
        router.push("/");
      }
    }

    if (!loading) {
      refetch();
      userFetch();
    }
  }, [loading, productError, userError, router, refetch, userFetch]);

  if (loading || !data || !user) {
    return (
      <Container user={user!} className="d-flex jc-center ai-center">
        <Loading />
      </Container>
    );
  }

  return (
    <Container user={user!}>
      <div id="mainbar-full" className="user-show-new">
        <div id="main-content">
          <div className="d-flex gs24 md:fd-column">
            <div className="flex--item fl-grow1">
              <ProductSearch user={user!} data={data!} loading={loading} />
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

export default withApollo({ ssr: false })(Page);
