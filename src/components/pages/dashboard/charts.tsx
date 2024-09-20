import { MakeItSerializable, uuid } from "@src/utils";
import { odd } from "is";
import dynamic from "next/dynamic";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useMemo, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
interface Chart {
  date: Date;
  earnings: DataBase.Price;
}
interface SalesOverViewProps {
  data: {
    label: string;
    num: number;
  }[];
}
export function SalesOverView({ data }: SalesOverViewProps) {
  return (
    <BarChart
      skipAnimation
      dataset={data}
      xAxis={[{ scaleType: "band", dataKey: "label" }]}
      yAxis={[{ tickPlacement: "start" }]}
      series={[
        {
          dataKey: "num",
          valueFormatter: (val: number | null) => `${val}EGP`,
        },
      ]}
      height={400}
    />
  );
}
export function YearlyBreakUp({
  series,
}: {
  series: {
    label: string;
    num: number;
  }[];
}) {
  const chart: any = {
    color: "#adb5bd",
    series: series.map((val) => val.num),
    labels: series.map((val) => val.label),
    chart: {
      width: 180,
      type: "donut",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
        },
      },
    },
    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],

    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 150,
          },
        },
      },
    ],
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  return (
    <Chart
      options={chart}
      series={chart.series}
      type={chart.chart.type}
      width={chart.chart.width}
    />
  );
}
export function MonthlyEarnings({ series: dataSeries }: { series: number[] }) {
  const chartOptions: any = {
    chart: {
      id: "sparkline3",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: ["#f3feff"],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };

  const series = [
    {
      name: "Earnings",
      color: "#49BEFF",
      data: dataSeries,
    },
  ];

  return (
    <Chart options={chartOptions} series={series} type="area" height={60} />
  );
}
