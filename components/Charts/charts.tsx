"use client";

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
import { ProductsQuery } from "@/gen/gql";
import React from "react";
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

type Props = {
  data: ProductsQuery;
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

export function Component({ data }: Props) {
  const chartData = React.useMemo(() => {
    if (!data?.products) return [];

    return data.products
      .map((product) => {
        const totalQuantity = product.entry.reduce(
          (sum, entry) => sum + entry.quantity,
          0
        );
        return {
          title: product.title,
          quantity: totalQuantity,
        };
      })
      .filter((p) => p.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity);
  }, [data]);

  const totalQuantity = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <CardContent className="text-center py-10 text-muted-foreground">
        No hay productos con cantidades registradas.
      </CardContent>
    );
  }

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
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
            />
            <XAxis dataKey="quantity" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="quantity"
              name="Cantidad"
              layout="vertical"
              radius={5}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
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
            data={chartData}
            dataKey="quantity"
            nameKey="title"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
          >
            {chartData.map((entry, index) => (
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
