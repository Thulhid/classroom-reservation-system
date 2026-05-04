import { TrendingUp } from "lucide-react";

import type { BookingsOverTimePoint } from "@/features/dashboard/services/dashboardService";

type BookingsOverTimeChartProps = {
  data: BookingsOverTimePoint[];
  rangeLabel: string;
};

const chartHeight = 180;
const chartWidth = 640;
const chartPadding = {
  bottom: 30,
  left: 34,
  right: 18,
  top: 18,
};

function getPointCoordinates(data: BookingsOverTimePoint[]) {
  const maxBookings = Math.max(1, ...data.map((point) => point.bookings));
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right;
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  return data.map((point, index) => {
    const x =
      chartPadding.left +
      (data.length === 1
        ? innerWidth / 2
        : (index / (data.length - 1)) * innerWidth);
    const y =
      chartPadding.top +
      innerHeight -
      (point.bookings / maxBookings) * innerHeight;

    return {
      ...point,
      x,
      y,
    };
  });
}

export default function BookingsOverTimeChart({
  data,
  rangeLabel,
}: BookingsOverTimeChartProps) {
  const points = getPointCoordinates(data);
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = points.length
    ? `${path} L ${points.at(-1)?.x} ${chartHeight - chartPadding.bottom} L ${
        points[0].x
      } ${chartHeight - chartPadding.bottom} Z`
    : "";
  const totalBookings = data.reduce(
    (total, point) => total + point.bookings,
    0,
  );
  const peakBookings = Math.max(0, ...data.map((point) => point.bookings));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600">
            <TrendingUp size={18} />
            <h2 className="text-lg font-semibold text-slate-800">
              Bookings over time
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">{rangeLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-800">
            {totalBookings}
          </p>
          <p className="text-xs font-medium text-slate-500">total bookings</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg bg-slate-50 p-3">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label={`Bookings over time for ${rangeLabel}`}
          className="h-56 w-full"
        >
          <line
            x1={chartPadding.left}
            x2={chartWidth - chartPadding.right}
            y1={chartHeight - chartPadding.bottom}
            y2={chartHeight - chartPadding.bottom}
            className="stroke-slate-200"
            strokeWidth="1"
          />
          <line
            x1={chartPadding.left}
            x2={chartPadding.left}
            y1={chartPadding.top}
            y2={chartHeight - chartPadding.bottom}
            className="stroke-slate-200"
            strokeWidth="1"
          />
          {areaPath ? (
            <path d={areaPath} className="fill-sky-100/80" stroke="none" />
          ) : null}
          {path ? (
            <path
              d={path}
              fill="none"
              className="stroke-sky-600"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          ) : null}
          {points.map((point, index) => (
            <g key={point.date}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                className="fill-white stroke-sky-600"
                strokeWidth="3"
              />
              {index === 0 ||
              index === points.length - 1 ||
              point.bookings === peakBookings ? (
                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  className="fill-slate-600 text-[11px] font-semibold"
                >
                  {point.bookings}
                </text>
              ) : null}
              {index % 3 === 0 || index === points.length - 1 ? (
                <text
                  x={point.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px] font-medium"
                >
                  {point.label}
                </text>
              ) : null}
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
