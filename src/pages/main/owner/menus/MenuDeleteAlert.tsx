import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MENUS_KEY } from "@/api/menus/keys";
import { menuMutations } from "@/api/menus/mutations";
import Alert from "@/components/overlay/Alert";
import { errorResponse } from "@/lib/error-response";
import { queryClient } from "@/lib/query-client";
import { useStoreId } from "@/stores/useStoreId";
import type { Menu } from "@/types/domain/menu";
import type { ModalProps } from "@/types/overlay";

interface MenuDeleteAlertProps extends ModalProps {
  deleteItems: Menu[];
}

function MenuDeleteAlert({ deleteItems, ...props }: Readonly<MenuDeleteAlertProps>) {
  const { storeId } = useStoreId();
  const { mutate: deleteMenu } = useMutation(menuMutations.deleteMenu());
  const { mutate: multiDeleteMenus } = useMutation(menuMutations.multiDeleteMenus());

  const renderText = () => {
    if (deleteItems?.length === 1) {
      return `을`;
    }
    return ` 외 ${deleteItems?.length - 1}개의 메뉴를`;
  };

  const handleConfirm = () => {
    if (!deleteItems?.length) return;

    if (deleteItems?.length === 1) {
      deleteMenu(
        {
          storeId: storeId!,
          menuId: deleteItems[0].menuId,
          categoryId: deleteItems[0].categoryId,
        },
        {
          onSuccess: () => {
            toast.success("메뉴 삭제가 완료되었습니다.");
            queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu });
            props.close();
          },
          onError: (error) => {
            toast.error(errorResponse(error).data.message);
          },
        }
      );
    } else {
      multiDeleteMenus(
        {
          storeId: storeId!,
          data: {
            menuIds: deleteItems.map((item) => item.menuId),
          },
        },
        {
          onSuccess: () => {
            toast.success("메뉴 삭제가 완료되었습니다.");
            queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu });
            props.close();
          },
          onError: (error) => {
            toast.error(errorResponse(error).data.message);
          },
        }
      );
    }
  };

  return (
    <Alert
      {...props}
      footer={
        <>
          <Alert.Cancel>닫기</Alert.Cancel>
          {deleteItems?.length > 0 && <Alert.Action onClick={handleConfirm}>삭제</Alert.Action>}
        </>
      }
    >
      <strong className="text-gray-0 font-semibold md:text-base md:whitespace-pre-line lg:text-xl lg:whitespace-normal">
        {deleteItems?.length ? (
          <>
            <span className="text-primary">{deleteItems[0].name}</span>
            {`${renderText()}\n삭제하시겠습니까?`}
          </>
        ) : (
          "선택한 메뉴가 없습니다."
        )}
      </strong>
    </Alert>
  );
}

export default MenuDeleteAlert;
