import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertCircle, ChevronRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function ResultCard({ title, issues, score }: any) {
  return (
  
    <div className="bg-[#0A0E14] rounded-md p-4 mb-3 flex flex-row items-center gap-4">
        <div className="bg-[#0e121a] rounded-full w-10 h-10 justify-center flex items-center">
        <AlertCircle className="size-6 text-gray-500" />
        </div>
        <div>
         <h3 className="text-xl font-normal">{title}</h3>
         <p className="text-gray-500 text-md font-medium">Score: {score}</p>
             {issues
              .filter((issue: any, index: number, arr: any[]) =>
                arr.findIndex((i: any) => i.title === issue.title) === index
              )
              .map((issue: any) => (
            <strong className="text-gray-500 text-md font-medium" key={issue.id}>{issue.title}</strong>
            ))}
            </div>

       


<AlertDialog>
  <AlertDialogTrigger asChild>
         <button className="ml-auto text-sm text-white hover:underline">
                <ChevronRight/>
            </button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  );
}

{/* 
      <h3 className="text-lg font-medium">{title}</h3>
      <p>Score: {score}</p>

      {issues.map((issue: any) => (
        
        <div className="flex flex-row items-center gap-2" key={issue.id}>
      
                <AlertCircle className="size-4 text-gray-500" />
    
          <strong>{issue.title}</strong>
          <p>{issue.description}</p>
        </div>
      ))} */}