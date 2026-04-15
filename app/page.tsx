"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Header } from "./components/header";
import { ChartRadialText } from "./components/radial-chart";
import { CodeEditor } from "./components/code-editor";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#181C22] p-6 gap-6">
          <div className="flex-1 min-w-0 min-h-0">
            <CodeEditor />
          </div>

            <div className="shrink-0 w-40px overflow-auto">
            <ChartRadialText />
            <div className="flex flex-col gap-4 mt-6">
            <h1 className="text-xl font-normal">
              Issue intelligence
            </h1>
            {/* cards */}
            
            </div>
            <Button className="w-full mt-12 h-12 text-xl font-bold bg-[#9ECAFF] border-[#9ECAFF] text-[#003258]">
              RUN DEEP ANALYSIS
            </Button>
            </div>

        </main>
      </SidebarProvider>
    </div>
  );
}
