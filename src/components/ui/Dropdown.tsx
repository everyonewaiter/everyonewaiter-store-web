import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "@/components/icons";
import cn from "@/lib/utils";

interface DropdownItem {
  id: string;
  name: string;
}

interface DropdownProps extends DropdownMenu.DropdownMenuProps {
  dropdownItems: DropdownItem[];
  hasError?: boolean;
  type?: "default" | "chip";
  defaultText: string;
  disabled?: boolean;
  onChange?: (item: DropdownItem) => void;
  value?: string;
  triggerClassName?: string;
  iconClassName?: string;
}

function Dropdown({
  value,
  dropdownItems,
  hasError,
  type = "default",
  defaultText,
  disabled,
  onChange,
  triggerClassName,
  iconClassName,
  ...props
}: Readonly<DropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  return (
    <div className="w-full">
      <DropdownMenu.Root open={isOpen} onOpenChange={disabled ? undefined : setIsOpen} {...props}>
        <DropdownMenu.Trigger
          disabled={disabled}
          className={cn(
            "text-s flex h-9! flex-row items-center rounded-lg! border border-gray-500! pr-3 pl-3 font-normal transition-colors hover:border-gray-500 focus:outline-none disabled:border-gray-600 disabled:bg-gray-700 disabled:text-gray-300 lg:h-12 lg:pl-4 lg:text-sm",
            hasError && "border-status-error",
            type === "chip"
              ? "h-9.5 w-fit justify-center gap-2.5 rounded-full"
              : "h-12 w-full justify-between rounded-xl py-2.5",
            disabled ? "cursor-default!" : "cursor-pointer!",
            triggerClassName
          )}
        >
          {selectedItem ? selectedItem.name : defaultText}
          <ChevronDown
            className={cn(
              `h-6 w-6 transition-transform duration-500`,
              isOpen && "rotate-180",
              type === "default" ? "text-gray-300" : "text-gray-0",
              iconClassName
            )}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={4}
            className={cn(
              "z-9999 mt-1 flex flex-col gap-1 rounded-2xl bg-white px-2 py-3 text-left shadow-[0px_2px_10px_rgba(0,0,0,0.08)]"
            )}
            style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}
          >
            {dropdownItems.map((dropdownItem) => (
              <DropdownMenu.Item
                key={dropdownItem.id}
                className={cn(
                  "text-gray-0 flex h-9 min-w-full cursor-pointer items-center rounded-xl px-3 text-sm font-normal outline-none md:rounded-lg",
                  value === dropdownItem.id ? "bg-gray-700" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(dropdownItem);
                  onChange?.(dropdownItem);
                  setIsOpen(false);
                }}
              >
                {dropdownItem.name}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export default Dropdown;
