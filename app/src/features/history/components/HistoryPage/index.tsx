"use client";

import { AppSidebar } from "@/app/components/app-sidebar";
import { Header } from "@/app/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChartAreaGradient } from "./EfficiencyScoreChart";
import { TableDemo } from "./AnalysisRunsTable";
import { AverageScore } from "./AverageScore";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#10141A] p-6 gap-6">
          <div className="flex-1 overflow-auto min-w-0 flex flex-col mb-12">
            <div className="flex flex-row gap-10 w-full mt-4">
              <ChartAreaGradient />
              <AverageScore />
            </div>

            <div className="flex flex-row items-center justify-between mt-8">
              <h1 className="text-xl font-medium m-5 ml-0 mt-12">
                Previous analysis runs
              </h1>
              <div className="flex gap-2">
                <Button className="bg-[#262A31] border-[0.5px] border-[#414755] p-5 font-light text-white text-md rounded-sm">
                  Export CSV
                </Button>
                <Button className="bg-[#262A31] border-[0.5px] border-[#414755] p-5 font-light text-white text-md rounded-sm">
                  Filters
                </Button>
              </div>
            </div>
            <TableDemo />

            <div>
              <div className="flex justify-between mt-10">
                <div className="flex flex-row gap-10">
                  <span className="text-sm text-[#8B90A0] flex items-center">
                    <span className="w-4 h-4 rounded-full bg-[#00E475] inline-block mr-2" />
                    Engine online
                  </span>
                  <span className="text-sm text-[#8B90A0]">
                    v0.0.1 Stable build
                  </span>
                </div>

                <div className="flex flex-row gap-10">
                  <span className="text-sm text-[#8B90A0] flex items-center">
                    <History className="w-4 h-4 inline-block mr-2" />
                    View full archive
                  </span>
                  <span className="text-sm text-[#8B90A0]">
                    Showing last 20 analyses
                  </span>
                </div>
              </div>
              <div className="w-full h-px bg-[#414755] mt-4 mb-4" />
              <span className="text-sm text-[#8B90A0]">
                © 2026 Refyne. All rights reserved.
              </span>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
