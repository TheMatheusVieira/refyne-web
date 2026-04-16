import { SearchX } from "lucide-react";

export function EmptyInfos() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 mt-2">
            <div className="size-14 rounded-full bg-[#1C2026] flex items-center justify-center">
                <SearchX className="size-8 text-[#9ECAFF]" />
            </div>
            <h2 className="text-lg font-medium text-gray-100">No information available</h2>
            <p className="text-sm text-gray-500">Please run an analysis to see the results here.</p>
        </div>
    );
}