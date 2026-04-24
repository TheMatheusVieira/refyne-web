import { Avatar, AvatarFallback, AvatarImage } from "@/app/src/components/ui/avatar";

export function Header() {
  return (
    <header className="flex items-center gap-4 border-b border-white/10 bg-[#10141A] py-6 px-5">
      <h1 className="text-2xl font-sans font-normal tracking-wide text-gray-100">
        REFYNE
      </h1>
      <div className="flex flex-1 justify-end items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm text-gray-400">
        <Avatar>
          <AvatarImage />
          <AvatarFallback>MV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
