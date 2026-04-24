"use client";

import { AppSidebar } from "@/app/src/components/app-sidebar";
import { Header } from "@/app/src/components/header";
import { Card } from "@/app/src/components/ui/card";
import { SidebarProvider } from "@/app/src/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { BrushCleaning, Gauge, ShieldCheck } from "lucide-react";

export default function RulesSettingsPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#10141A] p-6 gap-6">
          <div className="flex-1 overflow-auto min-w-0 flex flex-col mb-12">
            <div className="flex flex-col gap-2 w-full mb-10">
              <span className="text-[#00E475]">CONFIGURATION ENGINE</span>
              <h1 className="text-4xl font-medium ml-0">Analysis Rules</h1>
              <p className="text-[#C1C6D7]">Configure the tactical boundaries of your codebase. Select which patterns the<br/>
                engine should flag and define the urgency of each detection.</p>
            </div>

<ScrollArea className="h-full">

          <section className="mb-4">
            <div className="flex flex-row gap-2 items-center mb-4 border-b border-[#282C34] pb-2">
            <Gauge className="text-[#9ECAFF]"/>
            <h1 className="text-2xl font-medium">Performance</h1>
            </div>
        

          <Card className="w-full bg-transparent rounded-none ring-0">
            <div className="flex flex-col pl-2">
                    <div className="flex flex-col gap-1 mb-5">
                      <span className="text-lg">excessive-re-renders</span>
                      <p className="text-[#C1C6D7]">Detects components that trigger more than 5 renders within a 1s window using<br/>
                      dependency tracking.</p>       
                    </div>
                <div className="flex justify-between items-center">
                  <Switch id="excessive-re-renders" />
                      <select className="bg-[#1C2026] text-[#94A3B8] px-2 py-1 rounded flex justify-end ml-auto">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                </div>
            </div>
          </Card>

          <Card className="w-full bg-transparent rounded-none ring-0">
            <div className="flex flex-col pl-2">
                    <div className="flex flex-col gap-1 mb-5">
                      <span className="text-lg">bundle-size-exceeded</span>
                      <p className="text-[#C1C6D7]">Flags static assets imported directly into client-side bundles exceeding 500kb.</p>       
                    </div>
                <div className="flex justify-between items-center">
                  <Switch id="bundle-size-exceeded" />
                      <select className="bg-[#1C2026] text-[#94A3B8] px-2 py-1 rounded flex justify-end ml-auto">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                </div>
            </div>
          </Card>
          </section>

<section className="mb-4">
     <div className="flex flex-row gap-2 items-center mb-4 border-b border-[#282C34] pb-2">
        <BrushCleaning className="text-[#9ECAFF]"/>
        <h1 className="text-2xl font-medium">Clean Code</h1>
     </div>

          <Card className="w-full bg-transparent rounded-none ring-0">
            <div className="flex flex-col pl-2">
                    <div className="flex flex-col gap-1 mb-5">
                      <span className="text-lg">no-inline-functions</span>
                      <p className="text-[#C1C6D7]">Discourages the use of arrow functions directly in JSX props to prevent<br/>
unnecessary memory allocations.</p>
                    </div>
                <div className="flex justify-between items-center">
                  <Switch id="no-inline-functions" />

                      <select className="bg-[#1C2026] text-[#94A3B8] px-2 py-1 rounded flex justify-end ml-auto">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select> 
                </div>
            </div>
          </Card>

          <Card className="w-full bg-transparent rounded-none ring-0">
            <div className="flex flex-col pl-2">
                    <div className="flex flex-col gap-1 mb-5">
                      <span className="text-lg">magic-numbers-ban</span>
                      <p className="text-[#C1C6D7]">Enforces the use of named constants instead of raw numeric values in logic
blocks.</p>
                    </div>
                <div className="flex justify-between items-center">
                  <Switch id="magic-numbers-ban" />

                      <select className="bg-[#1C2026] text-[#94A3B8] px-2 py-1 rounded flex justify-end ml-auto">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select> 
                </div>
            </div>
          </Card>
</section>

<section className="mb-4">
      <div className="flex flex-row gap-2 items-center mb-4 border-b border-[#282C34] pb-2">
        <ShieldCheck className="text-[#9ECAFF]"/>
        <h1 className="text-2xl font-medium">Security</h1>
      </div>
</section>

</ScrollArea>

          </div>
        </main>
        <div className="bg-[#181C22] p-6 border-t border-[#282C34]">
          <span className="text-[#94A3B8]">RULE SUMMARY</span>
          <Card className="mt-4 p-4 bg-[#0A0E14] border-[#282C34]">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[#9ECAFF]">Performance</span>
                <span className="text-[#C1C6D7]">15 rules</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[#9ECAFF]">Security</span>
                <span className="text-[#C1C6D7]">10 rules</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[#9ECAFF]">Clean Code</span>
                <span className="text-[#C1C6D7]">20 rules</span>
              </div>
            </div>
          </Card>
        </div>
      </SidebarProvider>
    </div>
  );
}
