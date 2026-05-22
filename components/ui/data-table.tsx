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
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {empty ?? (
          <div className="py-16 text-center text-xs text-muted-foreground">No data.</div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="h-8 border-b border-border hover:bg-transparent bg-surface/60">
            {columns.map((col, ci) => (
              <TableHead
                key={col.id}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "h-8 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap",
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
              className="group h-[52px] border-b border-border/60 last:border-0 hover:bg-foreground/2 transition-colors"
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
