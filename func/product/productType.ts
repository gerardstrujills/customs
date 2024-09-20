type Product = {
  __typename?: "Product";
  id: number;
  title: string;
  description?: string | null;
  unitOfMeasurement: string;
  materialType: string;
  createdAt: any;
  updatedAt: any;
  withdrawal: Array<{
    __typename?: "Withdrawal";
    id: number;
    title?: string | null;
    quantity: number;
    endTime: any;
    createdAt: any;
    updatedAt: any;
  }>;
  entry: Array<{
    __typename?: "Entry";
    id: number;
    quantity: number;
    price: number;
    startTime: any;
    createdAt: any;
    updatedAt: any;
    supplier: {
      __typename?: "Supplier";
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
  }>;
};

type SortByCreatedAt = {
  data: Product[];
};

export const sortByCreatedAtDesc = ({ data }: SortByCreatedAt) => {
  if (data !== null && data !== undefined) {
    if (!data) {
      return null;
    }

    return data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (dateA > dateB) {
        return -1;
      } else if (dateA < dateB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  return null;
};

export const filterProductsByEntry = ({ data }: SortByCreatedAt) => {
  return data.filter((product) =>
    product.entry.some((entry) => entry.quantity > 0)
  );
};

export const getFilteredAndSortedProducts = ({
  data,
}: SortByCreatedAt): Product[] => {
  const filteredData = data.filter((product) => product.entry.length === 0);

  return filteredData.length > 0 ? filteredData : [];
};

export const getWithdrawalsFromProducts = ({ data }: SortByCreatedAt) => {
  if (!data || data.length === 0) {
    return [];
  }

  return data.filter((product) => product.withdrawal.length > 0);
};
