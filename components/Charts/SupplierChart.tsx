import {
  Bar,
  BarChart,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { SupplierQuery } from "@/gen/gql";

export const description = "Análisis de Productos y Entradas";

type Props = {
  data: SupplierQuery;
};

const chartConfig = {
  visitors: {
    label: "Cantidad",
  },
  product: {
    label: "Producto",
    color: "hsl(var(--chart-1))",
  },
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function SupplierChart({ data }: Props) {
  const supplier = data?.supplier;

  const chartTotal = React.useMemo(() => {
    return (
      supplier?.entry?.map((entry) => ({
        title: entry.product.title,
        quantity: entry.quantity,
      })) || []
    );
  }, [supplier]);

  const totalQuantity = React.useMemo(() => {
    return chartTotal.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [chartTotal]);

  const chartData = supplier?.entry?.map((entry) => ({
    title: entry.product.title,
    quantity: entry.quantity,
    fill: "var(--color-product)",
  }));

  return (
    <>
      <CardHeader>
        <CardTitle>Productos</CardTitle>
        <CardDescription>
          Mostrando la cantidad total de entradas por producto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="quantity" name="Cantidad" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="quantity"
              name="Cantidad"
              layout="vertical"
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardHeader>
        <CardTitle>Almacén</CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig} className="h-[160px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={chartTotal}
            dataKey="quantity"
            nameKey="title"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
          >
            {chartTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalQuantity.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        Cantidad Total
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </>
  );
}
