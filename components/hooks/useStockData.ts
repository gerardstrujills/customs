// hooks/useStockData.ts
import { useStockFiltersStore } from "@/components/stores/useStockFilterStore";
import { StockQuery } from "@/gen/gql";
import { useEffect } from "react";

export const useStockData = (stockData: StockQuery["stock"]) => {
  const { setUniqueFilterValues } = useStockFiltersStore();

  // Extraer y almacenar valores únicos cuando cambian los datos
  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const formattedData = stockData.map((item) => ({
        unitOfMeasurement: item.unitOfMeasurement,
        materialType: item.materialType,
        description: item.description || undefined,
      }));

      setUniqueFilterValues(formattedData);
    }
  }, [stockData, setUniqueFilterValues]);

  return { stockData };
};
