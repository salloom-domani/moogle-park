"use client";

import { BarDashboardChart } from "@/components/bar-chart";
import { AreaDashboardChart } from "@/components/area-chart";
import { PieDashboardChart } from "@/components/pie-chart";
import { InteractiveChart } from "@/components/interactive-chart";

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-10">
        <AreaDashboardChart />
        <BarDashboardChart />
        <PieDashboardChart />
      </div>
      <div>
        <InteractiveChart />
      </div>
    </>
  );
}
