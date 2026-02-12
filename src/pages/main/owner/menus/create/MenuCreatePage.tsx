import { useLocation } from "react-router-dom";
import MobileTitle from "@/components/layout/MobileTitle";
import MenuDetailContent from "@/pages/main/owner/menus/MenuDetailContent";

function MenuCreatePage() {
  const location = useLocation();
  const categoryId = location.state?.categoryId;

  return (
    <div className="flex flex-col gap-8 px-5 py-6">
      <MobileTitle>메뉴 상세</MobileTitle>
      <MenuDetailContent entry="create" initialCategoryId={categoryId} close={() => {}} isOpen />
    </div>
  );
}

export default MenuCreatePage;
