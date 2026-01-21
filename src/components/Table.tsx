import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
};

export default function Table<T extends Record<string, any>>({
  title,
  columns,
  data,
  emptyMessage = "No data available",
}: TableProps<T>) {
  return (
    <Card className="w-full rounded-2xl shadow-sm">
      <CardContent className="p-4">
        {title && (
          <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
        )}
        <UITable>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </UITable>
      </CardContent>
    </Card>
  );
}
