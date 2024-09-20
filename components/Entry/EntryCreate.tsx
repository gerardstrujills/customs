import {
  ProductsDocument,
  ProductsQuery,
  useCreateEntryMutation,
} from "@/gen/gql";
import React from "react";
import ModalWrapper from "../ModalWrapper";
import { Form, Formik } from "formik";
import { InputField } from "../InputField";
import { Button } from "@chakra-ui/react";
import { toErrorMap } from "@/utils/toErrorMap";

type Product = {
  id: number;
  description?: string | null;
  materialType: string;
  title: string;
  unitOfMeasurement: string;
  createdAt: any;
  updatedAt: any;
};

type CreateProps = {
  ruc: string;
  quantity: number;
  price: number;
  startTime: string;
};

type Props = {
  product: Product;
  isOpen: boolean;
  handleClose: () => void;
};

const EntryCreate = ({ isOpen, product, handleClose }: Props) => {
  const [createEntry] = useCreateEntryMutation();
  const productId = product.id;

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} className="ws4 p12">
      <Formik
        initialValues={{
          productId,
          ruc: "",
          quantity: 0,
          price: 0,
          startTime: new Date().toISOString(),
        }}
        onSubmit={async (values: CreateProps, { setErrors }) => {
          const response = await createEntry({
            variables: {
              input: {
                productId,
                ...values,
                quantity: Number(values.quantity),
                startTime: new Date(values.startTime).toISOString(),
              },
            },
            update: (cache, { data }) => {
              const existing = cache.readQuery<ProductsQuery>({
                query: ProductsDocument,
              });

              if (existing?.products && data?.createEntry.entry) {
                const newEntry = data.createEntry.entry;

                const updatedProducts = existing.products.map((product) => {
                  if (product.id === productId) {
                    return {
                      ...product,
                      entry: [...product.entry, newEntry],
                    };
                  }
                  return product;
                });

                cache.writeQuery<ProductsQuery>({
                  query: ProductsDocument,
                  data: {
                    products: updatedProducts,
                  },
                });
              }
            },
          });

          if (response.data?.createEntry.errors) {
            setErrors(toErrorMap(response.data.createEntry.errors));
          } else if (response.data?.createEntry.entry) {
            handleClose();
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="fs-headline1 mb8 fc-black-700">Proveedor</div>
            <span className="fs-caption fc-black-400 ta-left">
              Coordina con tu proveedor la gestión del producto de entrada para
              obtener más detalles y seguimiento.
            </span>
            <div className="d-flex fd-column gs4 gsy mt8">
              <InputField label="Ruc" name="ruc" />
              <InputField label="Cantidad" name="quantity" type="number" />
              <InputField
                label="Precio"
                name="price"
                type="number"
                step="0.01"
              />
              <InputField
                label="Fecha Ingreso"
                name="startTime"
                type="datetime-local"
                value={values.startTime.split(".")[0]}
                onChange={(e) => {
                  const isoDateTime = new Date(e.target.value).toISOString();
                  setFieldValue("startTime", isoDateTime);
                }}
              />
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

export default EntryCreate;
