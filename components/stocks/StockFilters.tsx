// components/Withdrawal/StockFilters.tsx
"use client";
import { Search } from "lucide-react";
import { useStockFiltersStore } from "../stores/useStockFilterStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export const StockFilters = () => {
  const { searchTerm, searchType, setSearchTerm, setSearchType, setFilters } =
    useStockFiltersStore();

  const handleSupplierSearch = () => {
    if (searchType === "supplier" && searchTerm) {
      setFilters({ supplierName: searchTerm });
    }
  };

  return (
    <div className="bg-white p-0 rounded-lg border border-gray-200 mb-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Campo de búsqueda */}
        <div className="flex-1 flex gap-2 items-center">
          <div className="flex-1 relative ml-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={
                searchType === "product"
                  ? "Buscar por nombre de producto..."
                  : "Buscar por nombre de proveedor..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchType === "supplier") {
                  handleSupplierSearch();
                }
              }}
            />
          </div>

          {searchType === "supplier" && (
            <Button
              onClick={handleSupplierSearch}
              className="whitespace-nowrap"
            >
              Buscar
            </Button>
          )}
        </div>
        {/* Selector de tipo de búsqueda */}
        <div className="flex-1">
          <Tabs
            value={searchType}
            onValueChange={(value) =>
              setSearchType(value as "product" | "supplier")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="product">Buscar Producto</TabsTrigger>
              <TabsTrigger value="supplier">Buscar Proveedor</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
