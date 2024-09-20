import {
  ProductsDocument,
  ProductsQuery,
  useCreateWithdrawalMutation,
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
  title: string;
  quantity: number;
  endTime: string;
};

type Props = {
  product: Product;
  isOpen: boolean;
  handleClose: () => void;
};

const WithdrawalCreate = ({ isOpen, product, handleClose }: Props) => {
  const [createWithdrawal] = useCreateWithdrawalMutation();
  const { id: productId } = product;

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} className="ws4 p12">
      <Formik
        initialValues={{
          productId,
          title: "",
          quantity: 0,
          endTime: new Date().toISOString(),
        }}
        onSubmit={async (values: CreateProps, { setErrors }) => {
          const response = await createWithdrawal({
            variables: {
              input: {
                productId,
                title: values.title,
                quantity: Number(values.quantity),
                endTime: new Date(values.endTime).toISOString(),
              },
            },
            update: (cache, { data }) => {
              const existing = cache.readQuery<ProductsQuery>({
                query: ProductsDocument,
              });

              if (existing?.products && data?.createWithdrawal.withdrawal) {
                const newWithdrawal = data.createWithdrawal.withdrawal;

                const updatedProducts = existing.products.map((product) => {
                  if (product.id === productId) {
                    const withdrawals = product.withdrawal || [];

                    const isExistingWithdrawal = withdrawals.some(
                      (withdrawal) => withdrawal.id === newWithdrawal.id
                    );

                    return {
                      ...product,
                      withdrawal: isExistingWithdrawal
                        ? withdrawals
                        : [...withdrawals, newWithdrawal],
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

          if (response.data?.createWithdrawal.errors) {
            setErrors(toErrorMap(response.data.createWithdrawal.errors));
          } else if (response.data?.createWithdrawal.withdrawal) {
            handleClose();
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="fs-headline1 mb8 fc-black-700">Crear Salida</div>
            <span className="fs-caption fc-black-400 ta-left">
              Optimiza la gestión de tu almacén en las salidas de productos.
            </span>
            <div className="d-flex fd-column gs4 gsy mt8">
              <InputField label="Proyecto" name="title" />
              <InputField label="Cantidad" name="quantity" type="number" />
              <InputField
                label="Fecha Salida"
                name="endTime"
                type="datetime-local"
                value={values.endTime.split(".")[0]}
                onChange={(e) => {
                  const isoDateTime = new Date(e.target.value).toISOString();
                  setFieldValue("endTime", isoDateTime);
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

export default WithdrawalCreate;
