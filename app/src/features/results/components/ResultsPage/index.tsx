"use client";

import { AppSidebar } from "@/app/src/components/app-sidebar";
import { Header } from "@/app/src/components/header";
import { SidebarProvider } from "@/app/src/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResultsPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#10141A] p-6 gap-6">
          <div className="flex-1 overflow-auto min-w-0 flex flex-col mb-12">
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-4xl font-medium ml-0">Analysis results</h1>
              <span>Deep scan completed in 1.2s. Found 14 potential optimizations and vulnerabilities.</span>
            </div>

            <Tabs defaultValue="performance" className="w-full mt-6">
              <TabsList className="bg-[#1C2026] rounded-md p-1 w-max mb-4">
                <TabsTrigger value="performance" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
                  All issues (14)
                </TabsTrigger>
                <TabsTrigger value="clean-code" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
                  High (3)
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
                  Medium (8cxxl)
                </TabsTrigger>
                <TabsTrigger value="other" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
                  Low (3)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
