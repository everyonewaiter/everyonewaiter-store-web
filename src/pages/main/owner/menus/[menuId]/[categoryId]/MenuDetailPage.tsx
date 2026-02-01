import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { menuQueries } from "@/api/menus/queries";
import Spinner from "@/components/feedback/Spinner";
import MobileTitle from "@/components/layout/MobileTitle";
import MenuDetailContent from "@/pages/main/owner/menus/MenuDetailContent";
import { useStoreId } from "@/stores/useStoreId";
import type { MenuDetail } from "@/types/domain/menu";

function MenuDetailPage() {
  const { menuId, categoryId } = useParams<{
    menuId: string;
    categoryId: string;
  }>();

  const { storeId } = useStoreId();

  const { data, isLoading } = useQuery(
    menuQueries.getMenuDetail({
      menuId: menuId as string,
      categoryId: categoryId as string,
      storeId: storeId!,
    })
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-8 px-5 py-6">
      <MobileTitle>메뉴 상세</MobileTitle>
      <MenuDetailContent
        entry="detail"
        menu={data as MenuDetail}
        initialCategoryId={categoryId}
        close={() => {}}
        isOpen
      />
    </div>
  );
}

export default MenuDetailPage;
