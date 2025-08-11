"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  WPM: {
    label: "WPM",
    color: "#5eead4",
  },
  accuracy: {
    label: "accuracy",
    color: "#d8b4fe",
  },
} satisfies ChartConfig;

export function Component({
  data,
}: {
  data: { month: string; WPM: number; accuracy: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="WPM" fill="var(--color-WPM)" radius={4} />
        <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
