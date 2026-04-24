"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/src/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/app/src/components/ui/chart"

const chartConfig = {
  score: {
    label: "Score",
  },
  value: {
    label: "Value",
    color: "#00E475",
  },
} satisfies ChartConfig

export function ChartRadialText({ score = 0, description, issue }: { score?: number; description?: string; issue?: { title: string } }) {
  const chartData = [
    { name: "score", value: score, fill: "var(--color-value)", description: description, issue: issue },
  ]
  const endAngle = (score / 100) * 360
  return (
    <Card className="flex flex-col bg-[#1C2026] size-120">
      <CardHeader className="items-center pb-0 pt-5 text-center">
        <CardTitle>PERFORMANCE SCORE</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-70.5"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            outerRadius={90}
            innerRadius={80}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[90, 80]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {score}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                         /100
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium text-[#00E475]">
        {description} <TrendingUp className="h-4 w-4" />
        </div>
        {issue?.title && (
          <div className="leading-none text-muted-foreground">
            {issue.title}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
