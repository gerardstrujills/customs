// stores/useStockFilterStore.ts
import { StockFilters } from "@/gen/gql";
import { endOfToday, startOfToday, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

interface StockFiltersStore {
  filters: StockFilters;

  searchTerm: string;
  searchType: "product" | "supplier";

  dateRange: DateRange;

  uniqueFilterValues: {
    unitOfMeasurement: string[];
    materialType: string[];
    description: string[];
  };

  selectedFilters: {
    unitOfMeasurement?: string;
    materialType?: string;
    description?: string;
  };

  setSearchTerm: (term: string) => void;
  setSearchType: (type: "product" | "supplier") => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setFilters: (filters: Partial<StockFilters>) => void;
  setSelectedFilters: (
    filters: Partial<{
      unitOfMeasurement?: string;
      materialType?: string;
      description?: string;
    }>
  ) => void;
  setUniqueFilterValues: (
    stockData: Array<{
      unitOfMeasurement: string;
      materialType: string;
      description?: string | null;
    }>
  ) => void;
  resetFilters: () => void;
  resetSelectedFilters: () => void;

  // Nueva propiedad para almacenar los datos crudos del stock
  rawStockData: Array<{
    unitOfMeasurement: string;
    materialType: string;
    description?: string | null;
  }> | null;

  // Setters
  setRawStockData: (
    stockData: Array<{
      unitOfMeasurement: string;
      materialType: string;
      description?: string | null;
    }> | null
  ) => void;

  // Selector computado que combina filters + selectedFilters
  getCombinedFilters: () => StockFilters;
}

export const useStockFiltersStore = create<StockFiltersStore>((set, get) => ({
  rawStockData: null,
  setRawStockData: (stockData) => {
    set({ rawStockData: stockData });

    // Automáticamente actualizar los valores únicos cuando se setean los datos
    if (stockData && stockData.length > 0) {
      const uniqueUnits = Array.from(
        new Set(stockData.map((item) => item.unitOfMeasurement).filter(Boolean))
      ).sort();

      const uniqueMaterials = Array.from(
        new Set(stockData.map((item) => item.materialType).filter(Boolean))
      ).sort();

      const uniqueDescriptions = Array.from(
        new Set(
          stockData
            .map((item) => item.description)
            .filter(Boolean)
            .filter((desc): desc is string => typeof desc === "string")
        )
      ).sort();

      set({
        uniqueFilterValues: {
          unitOfMeasurement: uniqueUnits,
          materialType: uniqueMaterials,
          description: uniqueDescriptions,
        },
      });
    } else {
      set({
        uniqueFilterValues: {
          unitOfMeasurement: [],
          materialType: [],
          description: [],
        },
      });
    }
  },

  filters: {},
  searchTerm: "",
  searchType: "product",
  dateRange: {
    from: subDays(startOfToday(), 6),
    to: endOfToday(),
  },
  uniqueFilterValues: {
    unitOfMeasurement: [],
    materialType: [],
    description: [],
  },
  selectedFilters: {},

  setSearchTerm: (searchTerm) => set({ searchTerm }),

  setSearchType: (searchType) => set({ searchType }),

  setDateRange: (dateRange) => {
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      const toDate = dateRange.to
        ? new Date(dateRange.to)
        : new Date(dateRange.from);

      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      set({
        dateRange: {
          from: fromDate,
          to: toDate,
        },
        filters: {
          startTime: fromDate.toISOString(),
          endTime: toDate.toISOString(),
        },
      });
    } else {
      set({
        dateRange: { from: undefined, to: undefined },
        filters: {
          startTime: undefined,
          endTime: undefined,
        },
      });
    }
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSelectedFilters: (newSelectedFilters) =>
    set((state) => ({
      selectedFilters: { ...state.selectedFilters, ...newSelectedFilters },
    })),

  setUniqueFilterValues: (stockData) => {
    if (!stockData || stockData.length === 0) {
      set({
        uniqueFilterValues: {
          unitOfMeasurement: [],
          materialType: [],
          description: [],
        },
      });
      return;
    }

    const uniqueUnits = Array.from(
      new Set(stockData.map((item) => item.unitOfMeasurement).filter(Boolean))
    ).sort();

    const uniqueMaterials = Array.from(
      new Set(stockData.map((item) => item.materialType).filter(Boolean))
    ).sort();

    const uniqueDescriptions = Array.from(
      new Set(
        stockData
          .map((item) => item.description)
          .filter(Boolean)
          .filter((desc): desc is string => typeof desc === "string")
      )
    ).sort();

    set({
      uniqueFilterValues: {
        unitOfMeasurement: uniqueUnits,
        materialType: uniqueMaterials,
        description: uniqueDescriptions,
      },
    });
  },

  resetFilters: () =>
    set({
      filters: {},
      searchTerm: "",
      searchType: "product",
      dateRange: {
        from: subDays(startOfToday(), 6),
        to: endOfToday(),
      },
      selectedFilters: {},
    }),

  resetSelectedFilters: () =>
    set({
      selectedFilters: {},
    }),

  // Selector computado que combina todos los filtros
  getCombinedFilters: () => {
    const state = get();
    const combinedFilters: StockFilters = {
      ...state.filters,
    };

    // Agregar selectedFilters a los filtros combinados
    if (state.selectedFilters.unitOfMeasurement) {
      combinedFilters.unitOfMeasurement =
        state.selectedFilters.unitOfMeasurement;
    }

    if (state.selectedFilters.materialType) {
      combinedFilters.materialType = state.selectedFilters.materialType;
    }

    if (state.selectedFilters.description) {
      combinedFilters.description = state.selectedFilters.description;
    }

    return combinedFilters;
  },
}));
