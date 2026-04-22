import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "Oct 24, 2023",
    paymentStatus: "auth_handler_v2.go",
    totalAmount: "98",
    paymentMethod: "0 Issues",
    action: "View Report",
  },
  {
    invoice: "Oct 25, 2023",
    paymentStatus: "main_renderer.py",
    totalAmount: "72",
    paymentMethod: "12 Issues",
    action: "View Report",
  },
  {
    invoice: "Oct 26, 2023",
    paymentStatus: "data_pipeline_orchestrator",
    totalAmount: "45",
    paymentMethod: "31 Critical Issues",
    action: "View Report",
  },
  {
    invoice: "Oct 27, 2023",
    paymentStatus: "utils_common.ts",
    totalAmount: "89",
    paymentMethod: "4 Issues",
    action: "View Report",
  },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-40">DATE / TIME</TableHead>
          <TableHead>FILE / PROJECT NAME</TableHead>
          <TableHead>EFFICIENCY SCORE</TableHead>
          <TableHead>ISSUES DETECTED</TableHead>
          <TableHead className="text-right">ACTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell><span className="w-18 h-2 items-center inline-block mr-2 bg-[#31353C] rounded-full"/>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            <TableCell className="text-right"><Button>{invoice.action}</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
