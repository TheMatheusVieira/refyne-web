"use client";

import { AppSidebar } from "@/app/components/app-sidebar";
import { Header } from "@/app/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChartAreaGradient } from "./EfficiencyScoreChart";
import { TableDemo } from "./AnalysisRunsTable";



export default function HistoryPage() {

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#10141A] p-6 gap-6">

            <div className="shrink-0 w-40px overflow-auto">
           
            <ChartAreaGradient />
            <h1 className="text-xl font-normal m-5">
              Previous Analysis Runs
            </h1>
            <TableDemo />
            </div>

        </main>
      </SidebarProvider>
    </div>
  );
}
