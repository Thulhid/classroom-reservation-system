import BookingsOverTimeChart from "@/features/dashboard/components/BookingsOverTimeChart";
import RoomUtilizationChart from "@/features/dashboard/components/RoomUtilizationChart";
import { getAdminDashboardChartData } from "@/features/dashboard/services/dashboardService";

export default async function AdminDashboardCharts() {
  const chartData = await getAdminDashboardChartData();

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <BookingsOverTimeChart
        data={chartData.bookingsOverTime}
        rangeLabel={chartData.rangeLabel}
      />
      <RoomUtilizationChart
        data={chartData.roomUtilization}
        rangeLabel={chartData.rangeLabel}
      />
    </div>
  );
}
