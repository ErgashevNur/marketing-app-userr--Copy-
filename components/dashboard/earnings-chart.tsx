"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/utils";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const mockEarningsData = {
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [1, 13, 10, 17, 14, 20, 16],
  },
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [40, 55, 40, 70],
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [300, 350, 320, 400, 380, 500],
  },
};

type TimeRange = "daily" | "weekly" | "monthly";

export function EarningsChart() {
  const { t, currency } = useLanguage();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const data = {
    labels: mockEarningsData[timeRange].labels,
    datasets: [
      {
        label: t("earnings"),
        data: mockEarningsData[timeRange].data,
        borderColor: "#888F74",
        backgroundColor: "rgba(136, 143, 116, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${t("earnings")}: ${formatCurrency(context.parsed.y, currency)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value as number, currency),
        },
      },
    },
  };

  const totalEarnings = mockEarningsData[timeRange].data.reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("earningsHistory")}</CardTitle>
        <CardDescription>{t("registeredSince")}: 01/01/2023</CardDescription>
        <div className="flex gap-2 mt-2">
          <Button
            variant={timeRange === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("daily")}
          >
            {t("daily")}
          </Button>
          <Button
            variant={timeRange === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("weekly")}
          >
            {t("weekly")}
          </Button>
          <Button
            variant={timeRange === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("monthly")}
          >
            {t("monthly")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="h-[600px] w-full">
          <Line data={data} options={options} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">{t("totalEarnings")}</p>
          <p className="text-2xl font-bold">
            {formatCurrency(totalEarnings, currency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
