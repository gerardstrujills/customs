"use client";
import { Search } from "lucide-react";
import { useWithdrawalFiltersStore } from "../stores/useWithdrawalsFiltersStore";
import { Input } from "../ui/input";

export const WithdrawalFilters = () => {
  const { searchTerm, searchType, setSearchTerm } = useWithdrawalFiltersStore();

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
            />
          </div>
        </div>
      </div>
    </div>
  );
};
