import { Card, CardContent } from "~/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "~/components/ui/chart";
import { AreaChart, Area, Tooltip, CartesianGrid, YAxis } from "recharts";
import { mockChartData } from "../data";

const chartConfig = {
  makeRate: {
    label: "Make Rate",
    theme: {
      light: "#16a34a", // Green visible on light background
      dark: "#22c55e", // Green visible on dark background
    },
  },
};

export function SessionProgressChart() {
  return (
    <Card className="col-span-4">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Session Progress</h3>
          <p className="text-xs text-muted-foreground">
            Make rate over recent sessions
          </p>
        </div>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart accessibilityLayer data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis hide domain={[0, "auto"]} />
            <Area
              type="monotone"
              dataKey="makeRate"
              fill="#22c55e"
              fillOpacity={0.2}
              stroke="var(--color-makeRate)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Tooltip content={<ChartTooltipContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
