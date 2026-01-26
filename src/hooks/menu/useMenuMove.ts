import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { menuMutations } from '@/api/menus/mutations';
import { errorResponse } from '@/lib/error-response';
import type { MoveRequest } from '@/types/api';

function useMenuMove() {
	const { mutateAsync: moveMenus } = useMutation(menuMutations.moveMenus())

	const [isSubmittingOrderChange, setIsSubmittingOrderChange] = useState<boolean>(false);
  const [isChangedToMenuOrder, setIsChangedToMenuOrder] = useState(false);
  const [changeOrdersList, setChangeOrdersList] = useState<MoveRequest[]>([]);

	/**
   * 메뉴 순서 변경 초기화 기능
   */
  const handleResetMoves = () => {
    setChangeOrdersList([]);
    setIsChangedToMenuOrder(false);
  };

  /**
   * 메뉴 순서 변경 기능
   */
	const handleSaveMoves = async () => {
		const storeId = localStorage.getItem('storeId') as string;

    try {
      setIsSubmittingOrderChange(true);

      for (const { sourceId, targetId, where } of changeOrdersList) {
        await moveMenus({ storeId, sourceId, targetId, where });
      }

      toast.success("메뉴 순서 변경이 완료되었습니다.");
      handleResetMoves();
    } catch (error) {
      toast.error(errorResponse(error).data.message);
    } finally {
      setIsSubmittingOrderChange(false);
    }
  };
	
	return {
		isSubmittingOrderChange,
		isChangedToMenuOrder,
		changeOrdersList,
		saveMoves: handleSaveMoves,
		resetMoves: handleResetMoves,
		changeToMenuOrder: () => setIsChangedToMenuOrder(true),
		addToChangeList: (props: MoveRequest) => setChangeOrdersList((prev) => [...prev, props]),
	}
}

export default useMenuMove;