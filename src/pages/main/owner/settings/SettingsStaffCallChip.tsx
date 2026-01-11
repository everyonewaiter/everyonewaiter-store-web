import type { PropsWithChildren } from "react";
import { Close, DragDrop } from "@/components/icons";
import Button from "@/components/ui/Button/Button";

function SettingsStaffCallChip({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        color="grey"
        className="text-gray-0 h-7.5 items-center gap-2.5 rounded-[20px] bg-gray-700 px-3 py-1.5 text-xs font-normal"
      >
        {children}
        <Close className="size-4 text-gray-300" />
      </Button>
      <DragDrop className="size-5 cursor-pointer text-gray-300" />
    </div>
  );
}

export default SettingsStaffCallChip;
