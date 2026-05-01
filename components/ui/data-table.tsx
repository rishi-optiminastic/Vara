import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T> {
  id: string
  label: string
  align?: "left" | "right"
  width?: string
  className?: string
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T extends object> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getKey: (row: T) => string
  empty?: React.ReactNode
}

export function DataTable<T extends object>({
  columns,
  rows,
  getKey,
  empty,
}: DataTableProps<T>): React.JSX.Element {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white/70 shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_16px_-8px_rgba(55,50,47,0.08)] overflow-hidden">
        {empty ?? (
          <div className="py-16 text-center text-xs text-muted-foreground">No data.</div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white/70 shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_16px_-8px_rgba(55,50,47,0.08)] overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="h-8 border-b border-[rgba(55,50,47,0.08)] hover:bg-transparent bg-[#FAFAF8]/80">
            {columns.map((col, ci) => (
              <TableHead
                key={col.id}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "h-8 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/55 whitespace-nowrap",
                  col.align === "right" && "text-right",
                  ci === 0 && "pl-4",
                  ci === columns.length - 1 && "pr-4",
                  col.className,
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={getKey(row)}
              className="group h-[52px] border-b border-[rgba(55,50,47,0.05)] last:border-0 hover:bg-[rgba(55,50,47,0.015)] transition-colors"
            >
              {columns.map((col, ci) => (
                <TableCell
                  key={col.id}
                  className={cn(
                    "py-0 align-middle",
                    col.align === "right" && "text-right",
                    ci === 0 && "pl-4",
                    ci === columns.length - 1 && "pr-4",
                    col.className,
                  )}
                >
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
