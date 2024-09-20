import { useUpdateEntryMutation } from "@/gen/gql";
import React from "react";
import ModalWrapper from "../ModalWrapper";
import { Form, Formik } from "formik";
import { InputField } from "../InputField";
import { Button } from "@chakra-ui/react";
import { toErrorMap } from "@/utils/toErrorMap";

type Entry = {
  id: number;
  quantity: number;
  price: number;
  startTime: any;
  createdAt: any;
  updatedAt: any;
  supplier: {
    id: number;
    name: string;
    ruc?: string | null;
    district?: string | null;
    province?: string | null;
    department?: string | null;
    productCount: number;
    createdAt: any;
    updatedAt: any;
  };
};

type CreateProps = {
  quantity: number;
  price: number;
  startTime: string;
};

type Props = {
  entry: Entry;
  isOpen: boolean;
  handleClose: () => void;
};

const EntryUpdate = ({ isOpen, entry, handleClose }: Props) => {
  const [updateEntry] = useUpdateEntryMutation();

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} className="ws4 p12">
      <Formik
        initialValues={{
          quantity: entry.quantity,
          price: entry.price,
          startTime: entry.startTime,
        }}
        onSubmit={async (values: CreateProps, { setErrors }) => {
          const response = await updateEntry({
            variables: {
              id: entry.id,
              input: { ...values },
            },
          });

          if (response.data?.updateEntry.errors) {
            setErrors(toErrorMap(response.data.updateEntry.errors));
          } else if (response.data?.updateEntry.entry) {
            handleClose();
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="fs-title mb8 fc-black-700">
              Actualizar entrada
            </div>
            <span className="fs-caption topic-tag topic-tag-link">
              {entry.supplier.name}
            </span>
            <span className="fs-caption ml4 topic-tag topic-tag-link">
              {entry.supplier.ruc}
            </span>
            <div className="d-flex fd-column gs4 gsy mt8">
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

export default EntryUpdate;
