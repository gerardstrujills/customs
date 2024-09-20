import React from "react";
import ModalWrapper from "../ModalWrapper";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/react";
import { InputField } from "../InputField";
import {
  ProductsDocument,
  ProductsQuery,
  useCreateProductMutation,
} from "@/gen/gql";
import { toErrorMap } from "@/utils/toErrorMap";

type CreateProps = {
  title: string;
  description: string;
  unitOfMeasurement: string;
  materialType: string;
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

const ProductCreate = ({ isOpen, handleClose }: Props) => {
  const [createProduct] = useCreateProductMutation();
  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} className="ws4 p12">
      <Formik
        initialValues={{
          title: "",
          description: "",
          unitOfMeasurement: "",
          materialType: "",
        }}
        onSubmit={async (values: CreateProps, { setErrors }) => {
          const response = await createProduct({
            variables: {
              input: {
                ...values,
              },
            },
            update: (cache, { data }) => {
              const existingProducts = cache.readQuery<ProductsQuery>({
                query: ProductsDocument,
              });

              if (existingProducts?.products && data?.createProduct.product) {
                cache.writeQuery<ProductsQuery>({
                  query: ProductsDocument,
                  data: {
                    products: [
                      ...existingProducts.products,
                      {
                        ...data.createProduct.product,
                        withdrawal: [],
                        entry: [],
                      },
                    ],
                  },
                });
              }
            },
          });

          if (response.data?.createProduct.errors) {
            setErrors(toErrorMap(response.data.createProduct.errors));
          } else if (response.data?.createProduct.product) {
            handleClose();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="fs-headline1 mb8 fc-black-700">Crear Producto</div>
            <span className="fs-caption fc-black-400 ta-left">Desarrolla tus productos más innovadores para tu almacén y gestiona su seguimiento de manera eficiente.</span>
            <div className="d-flex fd-column gs4 gsy mt8">
              <InputField label="Título" name="title" />
              <InputField label="Descripción" name="description" />
              <InputField label="U/M" name="unitOfMeasurement" />
              <InputField label="Tipo Material" name="materialType" />
              <Button
                isLoading={isSubmitting}
                type="submit"
                className="flex--item s-btn s-btn__primary p6"
              >
                Continuar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
};

export default ProductCreate;
