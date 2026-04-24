"use client";

import { AppSidebar } from "@/app/src/components/app-sidebar";
import { Header } from "@/app/src/components/header";
import { SidebarProvider } from "@/app/src/components/ui/sidebar";

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
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
