import { Dialog } from "@/components/overlay/Dialog";
import MenuDetailContent from "@/pages/main/owner/menus/MenuDetailContent";
import { MENU_DETAILS_MOCK } from "@/pages/main/owner/menus/mock";
import type { ModalProps } from "@/types/overlay";

interface MenuDetailModalProps extends ModalProps {
  menuId?: string;
  entry: "create" | "detail";
  initialCategoryId?: string;
}

function MenuDetailModal({ menuId, entry, ...props }: Readonly<MenuDetailModalProps>) {
  const menu = MENU_DETAILS_MOCK.find((menu) => menu.menuId === menuId) ?? MENU_DETAILS_MOCK[0];

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && props.close()}>
      <Dialog.Wrapper
        className="hidden text-start md:block md:aspect-912/621 md:h-[600px] md:min-w-[960px] md:overflow-y-auto md:p-5 lg:h-auto lg:w-[1344px]! lg:max-w-full! lg:overflow-y-hidden lg:rounded-[32px] lg:p-8"
        flexDirection="col"
      >
        <MenuDetailContent menu={menu} entry={entry} {...props} />
      </Dialog.Wrapper>
    </Dialog>
  );
}

export default MenuDetailModal;
