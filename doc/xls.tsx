import { formatMonthAndDay } from "@/func/typeDate";
import { capitalizeWords } from "@/func/typeString";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import * as XLSX from "xlsx";

type Entry = {
  id: number;
  quantity: number;
  price: number;
  startTime: any;
  createdAt: any;
  updatedAt: any;
  product: {
    id: number;
    title: string;
    description?: string | null;
    unitOfMeasurement: string;
    materialType: string;
    createdAt: any;
    updatedAt: any;
  };
};

type Props = {
  entry?: Entry[] | null;
};

export default function Doc({ entry }: Props) {
  const [loading, setLoading] = useState(false);

  const data = entry;

  const Doc = () => {
    setLoading(true);

    const entryData = data?.map((entry) => ({
      Producto: entry.product.title,
      Cantidad: entry.quantity,
      Precio: entry.price,
      "Fecha de Entrada": capitalizeWords(
        formatMonthAndDay({ createdAt: entry.startTime })
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(entryData!);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");

    XLSX.writeFile(workbook, "exported_entries.xlsx");

    setLoading(false);
  };

  return (
    <Button
      onClick={Doc}
      isLoading={loading}
      className="d-flex s-btn s-btn__outlined s-btn__muted s-btn__icon s-btn__sm"
    >
      <svg
        height="16"
        viewBox="0 0 16 16"
        width="16"
        className="svg-icon iconTack d-block mx-auto"
      >
        <path d="m4.927 5.427 2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 5H8.75V.75a.75.75 0 1 0-1.5 0V5H5.104a.25.25 0 0 0-.177.427Z"></path>
        <path d="M1.573 2.573a.25.25 0 0 0-.073.177v7.5a.25.25 0 0 0 .25.25h12.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-3a.75.75 0 1 1 0-1.5h3A1.75 1.75 0 0 1 16 2.75v7.5A1.75 1.75 0 0 1 14.25 12h-3.727c.099 1.041.52 1.872 1.292 2.757A.75.75 0 0 1 11.25 16h-6.5a.75.75 0 0 1-.565-1.243c.772-.885 1.192-1.716 1.292-2.757H1.75A1.75 1.75 0 0 1 0 10.25v-7.5A1.75 1.75 0 0 1 1.75 1h3a.75.75 0 0 1 0 1.5h-3a.25.25 0 0 0-.177.073ZM6.982 12a5.72 5.72 0 0 1-.765 2.5h3.566a5.72 5.72 0 0 1-.765-2.5H6.982Z"></path>
      </svg>
      <div className="flex--item ml4">Excel</div>
    </Button>
  );
}
