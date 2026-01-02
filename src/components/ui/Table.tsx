import type { ComponentProps } from "react";
import cn from "@/lib/utils";

function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: Readonly<ComponentProps<"thead">>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "flex items-center justify-center rounded-2xl bg-gray-700 md:h-12 lg:h-16",
        className
      )}
      {...props}
    />
  );
}
Table.Header = TableHeader;
TableHeader.displayName = "Table.Header";

function TableBody({ className, ...props }: Readonly<ComponentProps<"tbody">>) {
  return <tbody data-slot="table-body" className={cn("w-full", className)} {...props} />;
}
Table.Body = TableBody;
TableBody.displayName = "Table.Body";

function TableRow({ className, ...props }: Readonly<ComponentProps<"tr"> & { isHead?: boolean }>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "flex w-full cursor-pointer border-b border-gray-600 last:border-none md:h-12 lg:h-16",
        className
      )}
      {...props}
    />
  );
}
Table.Row = TableRow;
TableRow.displayName = "Table.Row";

function TableHead({ className, ...props }: Readonly<ComponentProps<"th">>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-gray-0 flex h-full items-center justify-center font-bold md:text-sm lg:text-base",
        className
      )}
      {...props}
    />
  );
}
Table.Head = TableHead;
TableHead.displayName = "Table.Head";

function TableCell({ className, ...props }: Readonly<ComponentProps<"td">>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "text-gray-0 md:text-s flex h-full items-center justify-center font-normal lg:text-base lg:font-medium",
        className
      )}
      align="center"
      {...props}
    />
  );
}
Table.Cell = TableCell;
TableCell.displayName = "Table.Cell";

export default Table;
