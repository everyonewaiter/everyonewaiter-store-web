import { useLocation, useNavigate, useParams } from "react-router-dom";
import MenuDetailContent from "@/pages/main/owner/menus/MenuDetailContent";
import MenuMobileTitle from "@/pages/main/owner/menus/MenuMobileTitle";
import { MENU_DETAILS_MOCK } from "@/pages/main/owner/menus/mock";

function MenuDetailPage() {
  const navigate = useNavigate();
  const { menuId: urlMenuId } = useParams<{ menuId: string }>();
  const location = useLocation();
  const stateMenuId = location.state?.menuId;
  const entry = location.state?.entry || "detail";

  const menuId = urlMenuId || stateMenuId;

  if (!entry || !menuId || typeof menuId !== "string") return null;
  if (entry === "create" && menuId !== "create") return null;

  const menu =
    entry === "create" ? MENU_DETAILS_MOCK[0] : MENU_DETAILS_MOCK.find((m) => m.menuId === menuId);

  if (!menu && entry === "detail") return null;

  return (
    <div className="flex flex-col gap-8 px-5 py-6">
      <MenuMobileTitle />
      <MenuDetailContent entry={entry} menu={menu!} close={() => navigate(-1)} isOpen />
    </div>
  );
}

export default MenuDetailPage;
