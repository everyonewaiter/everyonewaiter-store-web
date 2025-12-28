import type { ComponentProps } from "react";
import cn from "@/lib/utils";

function MobileTable({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-table-container"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-gray-600 bg-white",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: Readonly<ComponentProps<"div">>) {
  return (
    <div
      data-slot="mobile-table-row"
      className={cn("center flex h-12 w-full cursor-pointer", className)}
      {...props}
    />
  );
}
MobileTable.Row = TableRow;
TableRow.displayName = "Table.Row";

function TableHead({ className, ...props }: Readonly<ComponentProps<"div">>) {
  return (
    <div
      data-slot="mobile-table-head"
      className={cn(
        "text-gray-0 center text-s flex h-full w-full flex-[0.4] items-center bg-gray-700 px-6 py-4 font-medium",
        className
      )}
      {...props}
    />
  );
}
MobileTable.Head = TableHead;
TableHead.displayName = "Table.Head";

function TableCell({ className, ...props }: Readonly<ComponentProps<"div">>) {
  return (
    <div
      data-slot="mobile-table-cell"
      className={cn(
        "text-gray-0 center text-s flex h-full flex-[0.6] items-center border-b border-b-gray-600 px-6 py-4 text-center font-normal",
        className
      )}
      {...props}
    />
  );
}
MobileTable.Cell = TableCell;
TableCell.displayName = "Table.Cell";

export default MobileTable;
