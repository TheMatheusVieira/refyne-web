"use client"

import { useEffect, useState, useMemo } from "react"
import { Area, AreaChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getLast7DaysEfficiency, type DailyEfficiency } from "@/app/src/features/history/services/storage"

const chartConfig = {
  score: {
    label: "Efficiency",
    color: "#00E475",
  },
} satisfies ChartConfig

export function ChartAreaGradient() {
  const [data, setData] = useState<DailyEfficiency[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(getLast7DaysEfficiency());
  }, []);

  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3);
    const older = data.slice(0, 3);
    const avgRecent = recent.reduce((s, d) => s + d.score, 0) / recent.length;
    const avgOlder = older.reduce((s, d) => s + d.score, 0) / older.length;
    if (avgOlder === 0) return avgRecent > 0 ? 100 : 0;
    return Number((((avgRecent - avgOlder) / avgOlder) * 100).toFixed(1));
  }, [data]);

  const trendColor = trend >= 0 ? "#00E475" : "#EF4444";
  const trendLabel = trend >= 0 ? `+${trend}%` : `${trend}%`;

  return (
    <Card className="bg-[#181C22] flex-1 min-w-0 flex flex-col">
      <CardHeader>
        <div className="flex flex-row items-center gap-4">
        <div>
      <CardTitle className="text-2xl">Efficiency score trend</CardTitle>
        <CardDescription>
          7-DAY PERFORMANCE VELOCITY
        </CardDescription>
        </div>
        <div className="w-32 h-10 items-center justify-center rounded-sm flex ml-auto mt-2" style={{ backgroundColor: `${trendColor}15` }}>
          <span className="w-3 h-3 inline-block rounded-full mr-1" style={{ backgroundColor: trendColor }} />
          <span className="text-lg font-bold" style={{ color: trendColor }}>{trendLabel}</span>
        </div>
        </div>
      </CardHeader>
      <CardContent className="h-50 w-full mt-auto">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart
            accessibilityLayer
            data={data}
            width={undefined}
            height={undefined}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-score)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-score)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="score"
              type="natural"
              fill="url(#fillScore)"
              fillOpacity={0.4}
              stroke="var(--color-score)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
