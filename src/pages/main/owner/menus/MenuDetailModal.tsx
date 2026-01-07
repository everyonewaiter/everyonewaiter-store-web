import { Dialog } from "@/components/overlay/Dialog";
import MenuDetailContent from "@/pages/main/owner/menus/MenuDetailContent";
import { MENU_DETAILS_MOCK } from "@/pages/main/owner/menus/mock";
import type { ModalProps } from "@/types/overlay";

interface MenuDetailModalProps extends ModalProps {
  // menuId?: string;
  entry: "create" | "detail";
}

function MenuDetailModal({ entry, ...props }: Readonly<MenuDetailModalProps>) {
  const menu = MENU_DETAILS_MOCK[0];

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && props.close()}>
      <Dialog.Wrapper
        className="hidden md:block md:aspect-912/621 md:h-full md:w-full md:overflow-y-auto md:rounded-none md:p-5! lg:h-auto lg:w-[1344px]! lg:max-w-full! lg:overflow-y-hidden lg:rounded-[32px] lg:p-8"
        flexDirection="col"
      >
        <MenuDetailContent menu={menu} entry={entry} {...props} />
      </Dialog.Wrapper>
    </Dialog>
  );
}

export default MenuDetailModal;
