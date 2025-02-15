import dynamic from "next/dynamic";
import { BarChart } from "@mui/x-charts/BarChart";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import React from "react"
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { LineChartProps, LineChart as OrgLineChart } from "@mui/x-charts";
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
  valueFormatter: (val: number | null) => string;
}
const style = {
  // [`.${axisClasses.root}`]: {
  //   [`.${axisClasses.tick}, .${axisClasses.line}`]: {
  //     stroke: "white",
  //   },
  //   [`.${axisClasses.tickLabel}`]: {
  //     fill: "white",
  //   },
  // },
};
export function SalesOverView({ data, valueFormatter }: SalesOverViewProps) {
  return (
    <div dir="ltr" className="tw-max-w-full">
      <BarChart
        sx={style}
        dataset={data}
        xAxis={[{ scaleType: "band", dataKey: "label" }]}
        yAxis={[
          {
            tickPlacement: "start",
            min: 0,

            max: data.reduce((acc, { num }) => (acc > num ? acc : num), 10),
          },
        ]}
        series={[
          {
            dataKey: "num",
            label: "Profit",
            valueFormatter,
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        height={400}
      />
    </div>
  );
}

export const LineChart = React.forwardRef<unknown, LineChartProps>(
  (props, ref) => {
    return <OrgLineChart {...props} ref={ref} sx={style} />;
  }
);
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
    <div dir="ltr">
      <Chart
        options={chart}
        series={chart.series}
        type={chart.chart.type}
        width={chart.chart.width}
      />
    </div>
  );
}
export function MonthlyEarnings({
  series: dataSeries,
  height,
}: {
  series: number[];
  height?: number;
}) {
  const chartOptions: any = {
    chart: {
      id: "sparkline3",
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
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
    <div dir="ltr">
      <Chart
        options={chartOptions}
        series={series}
        type="area"
        height={height || 60}
      />
    </div>
  );
}
interface PercentProps extends ComponentProps<"p"> {
  increasing: number;
}
export function Percent({ increasing, ...props }: PercentProps) {
  const { t } = useTranslation("dashboard");
  return (
    <div className="pb-1 tw-flex tw-items-center tw-gap-2">
      <p className="tw-flex tw-items-center tw-gap-1">
        <span className="rounded-circle bg-light-success round-20 tw-inline-flex align-items-center justify-content-center">
          {increasing > 0 ? (
            <i className="ti ti-arrow-up-left text-success" />
          ) : (
            <i className="ti ti-arrow-down-right text-danger" />
          )}
        </span>
        <span>{t("percent.num", { val: increasing })}</span>
      </p>
      <p {...props} />
    </div>
  );
}
