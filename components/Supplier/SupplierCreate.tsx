import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Form, Formik } from "formik";
import { InputField } from "../InputField";
import { Button } from "@chakra-ui/react";
import { toErrorMap } from "@/utils/toErrorMap";
import {
  useCreateSupplierMutation,
  useCreateSupplierRucMutation,
} from "@/gen/gql";

type CreateSupplierRuc = {
  ruc: string;
};

type CreateSupplierTemporary = {
  name: string;
  address?: string | null;
  district?: string | null;
  province?: string | null;
  department?: string | null;
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

function CreateSupplierRuc({ isOpen, handleClose }: Props) {
  const router = useRouter();
  const [sunat, setSunat] = useState<boolean>(true);
  const [temporary, setTemporary] = useState<boolean>(false);

  const handleToggleSunat = () => {
    if (!sunat) {
      setSunat(true);
      setTemporary(false);
    }
  };

  const handleToggleTemporary = () => {
    if (!temporary) {
      setSunat(false);
      setTemporary(true);
    }
  };

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const [createRuc] = useCreateSupplierRucMutation();
  const [createTemporary] = useCreateSupplierMutation();

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} className="ws4 p12">
      <div className="d-flex jc-space-between">
        <div className="flex--item mx-auto">
          <div id="tabs-interval" className="subtabs">
            <a
              onClick={handleToggleTemporary}
              className={temporary ? "youarehere is-selected" : ""}
            >
              <h3 className="fs-headline m0">Proveedor</h3>
            </a>
            <a
              onClick={handleToggleSunat}
              className={sunat ? "youarehere is-selected" : ""}
            >
              <h3 className="fs-headline m0">Sunat</h3>
            </a>
          </div>
        </div>
      </div>
      {sunat && (
        <Formik
          initialValues={{
            ruc: "",
          }}
          onSubmit={async (values: CreateSupplierRuc, { setErrors }) => {
            const response = await createRuc({
              variables: {
                input: {
                  ...values,
                },
              },
            });

            if (response.data?.createSupplierRuc.errors) {
              const errors = response.data.createSupplierRuc.errors
                .filter((error) => error.field === "duplicate")
                .map((error) => error.message)[0];
              if (errors) {
                handleClose();

                router.push(
                  `/suppliers/${
                    response.data.createSupplierRuc.errors.map(
                      (e) => e.message
                    )[0]
                  }`
                );
              } else {
                setErrors(toErrorMap(response.data.createSupplierRuc.errors));
              }
            } else if (response.data?.createSupplierRuc.supplier) {
              handleClose();
              router.push(
                `/suppliers/${response.data.createSupplierRuc.supplier.id}`
              );
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="d-flex fd-column gs4 gsy mt8">
                <InputField label="Ruc" name="ruc" />
                <span className="fc-black-500 mx4 mb12">
                  Nosotros nos encargaremos de autocompletar los datos
                </span>
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
      )}
      {temporary && (
        <Formik
          initialValues={{
            name: "",
            address: "",
            district: "",
            province: "",
            department: "",
          }}
          onSubmit={async (values: CreateSupplierTemporary, { setErrors }) => {
            if (values.address === "") {
              values.address = null;
            }

            if (values.district === "") {
              values.district = null;
            }

            if (values.province === "") {
              values.province = null;
            }

            if (values.department === "") {
              values.department = null;
            }

            const response = await createTemporary({
              variables: { input: { ...values } },
            });

            if (response.data?.createSupplier.errors) {
              const errors = response.data.createSupplier.errors
                .filter((error) => error.field === "duplicate")
                .map((error) => error.message)[0];

              if (errors) {
                handleClose();

                router.push(
                  `/suppliers/${
                    response.data.createSupplier.errors.map((e) => e.message)[0]
                  }`
                );
              } else {
                setErrors(toErrorMap(response.data.createSupplier.errors));
              }
            } else if (response.data?.createSupplier.supplier) {
              handleClose();
              router.push(
                `/suppliers/${response.data.createSupplier.supplier.id}`
              );
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="d-flex fd-column gs4 gsy mt8">
                <InputField label="Razón Social" name="name" />
                {showInfo && (
                  <>
                    <InputField label="Dirección" name="address" />
                    <InputField label="Distrito" name="district" />
                    <InputField label="Provincia" name="province" />
                    <InputField label="Departamento" name="department" />
                  </>
                )}

                <div className="d-flex gs8 gsx s-modal--footer mt16 jc-space-between">
                  <div className="flex-item">
                    <a onClick={handleToggleInfo} className="my8">
                      {showInfo ? "Ocultar Información" : "Mostrar Información"}
                    </a>
                  </div>
                  <div className="flex-item">
                    <Button
                      isLoading={isSubmitting}
                      type="submit"
                      className="flex--item s-btn s-btn__primary p6"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </ModalWrapper>
  );
}

export default CreateSupplierRuc;
