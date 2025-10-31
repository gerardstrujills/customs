// app/stocks/page.tsx
"use client";
import { withApollo } from "@/apollo/withApollo";
import Container from "@/components/Container";
import StockDateRangePicker from "@/components/stocks/StockDateRangePicker";
import { useStockFiltersStore } from "@/components/stores/useStockFilterStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockTable } from "@/components/Withdrawal/StockTable";
import { useMeQuery } from "@/gen/gql";
import { FilterX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { data: user, refetch: userFetch, error: userError } = useMeQuery();
  const router = useRouter();

  const {
    resetFilters,
    uniqueFilterValues,
    selectedFilters,
    setSelectedFilters,
  } = useStockFiltersStore();

  const handleFilterChange = (
    key: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters({
      ...selectedFilters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const handleClearFilters = () => {
    resetFilters();
  };

  useEffect(() => {
    if (userError) {
      if (userError.message === "not authenticated") {
        router.push("/");
      }
    } else {
      userFetch();
    }
  }, [userError, router, userFetch]);

  return (
    <Container user={user!}>
      <div id="mainbar-full" className="user-show-new">
        <div id="main-content">
          <h2 className="fs-title mb2">Stock Almacén</h2>
          <p className="fc-black-500 mb16">
            Visualiza y gestiona el inventario disponible en tiempo real.
            <br />
            La información se actualiza diariamente para mantener un control
            preciso del stock.
          </p>
          {/* Tabla */}
          <div className="d-flex gs24 md:fd-column">
            <div className="flex--item fl-grow1">
              <StockTable />
            </div>
            <div className="flex--item3 fl-shrink0 md:order-last mt0">
              <div className="d-grid">
                {/* Selector de rango de fechas */}
                <div className="flex-1 mb-2">
                  <Label htmlFor="unit-filter">Rango de Fechas</Label>
                  <StockDateRangePicker />
                </div>
                <div className="space-y-4">
                  {/* Filtro de Unidad de Medida */}
                  <div className="space-y-2">
                    <Label htmlFor="unit-filter">Unidad de Medida</Label>
                    <Select
                      value={selectedFilters.unitOfMeasurement || "all"}
                      onValueChange={(value) =>
                        handleFilterChange("unitOfMeasurement", value)
                      }
                    >
                      <SelectTrigger id="unit-filter">
                        <SelectValue placeholder="Todas las unidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las unidades</SelectItem>
                        {uniqueFilterValues.unitOfMeasurement.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro de Tipo de Material */}
                  <div className="space-y-2">
                    <Label htmlFor="material-filter">Tipo de Material</Label>
                    <Select
                      value={selectedFilters.materialType || "all"}
                      onValueChange={(value) =>
                        handleFilterChange("materialType", value)
                      }
                    >
                      <SelectTrigger id="material-filter">
                        <SelectValue placeholder="Todos los materiales" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todos los materiales
                        </SelectItem>
                        {uniqueFilterValues.materialType.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro de Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description-filter">Descripción</Label>
                    <Select
                      value={selectedFilters.description || "all"}
                      onValueChange={(value) =>
                        handleFilterChange("description", value)
                      }
                    >
                      <SelectTrigger id="description-filter">
                        <SelectValue placeholder="Todas las descripciones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las descripciones
                        </SelectItem>
                        {uniqueFilterValues.description.map((desc) => (
                          <SelectItem key={desc} value={desc}>
                            {desc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Botón para limpiar filtros */}
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="whitespace-nowrap my-4"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default withApollo({ ssr: false })(Page);
