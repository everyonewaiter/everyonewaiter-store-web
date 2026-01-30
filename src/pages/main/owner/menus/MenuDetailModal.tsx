import { useQuery } from "@tanstack/react-query";
import { menuQueries } from "@/api/menus/queries";
import { Dialog } from "@/components/overlay/Dialog";
import MenuDetailContent from "@/pages/main/owner/menus/MenuDetailContent";
import { useStoreId } from "@/stores/useStoreId";
import type { ModalProps } from "@/types/overlay";

interface MenuDetailModalProps extends ModalProps {
  menuId?: string;
  entry: "create" | "detail";
  initialCategoryId: string;
}

function MenuDetailModal({
  menuId,
  entry,
  initialCategoryId,
  ...props
}: Readonly<MenuDetailModalProps>) {
  const { storeId } = useStoreId();
  const { data: menu } =
    useQuery(
      menuQueries.getMenuDetail({
        storeId: storeId!,
        menuId: menuId as string,
        categoryId: initialCategoryId,
      })
    ) ?? null;

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && props.close()}>
      <Dialog.Wrapper
        className="hidden text-start md:block md:aspect-912/621 md:h-full md:max-h-[714px] md:min-h-[600px] md:min-w-[960px] md:overflow-hidden md:p-5 lg:h-full lg:max-h-0 lg:min-h-[930px] lg:w-[1344px]! lg:max-w-full! lg:overflow-hidden lg:rounded-[32px] lg:p-8"
        flexDirection="col"
      >
        <Dialog.Title className="sr-only">메뉴 정보</Dialog.Title>
        <MenuDetailContent
          menu={menu!}
          entry={entry}
          initialCategoryId={initialCategoryId}
          {...props}
        />
      </Dialog.Wrapper>
    </Dialog>
  );
}

export default MenuDetailModal;
