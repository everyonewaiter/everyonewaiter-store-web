import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MENUS_KEY } from '@/api/menus/keys';
import { menuMutations } from '@/api/menus/mutations';
import { errorResponse } from '@/lib/error-response';
import { queryClient } from '@/lib/query-client';
import type { MenuSchema } from '@/schema/menu.schema';
import type { MenuDetail } from '@/types/domain/menu';
import type { UseFormReturn } from 'react-hook-form';

interface UseMenuFormSubmitProps {
	form: UseFormReturn<MenuSchema>;
	menu: MenuDetail;
	isCreating: boolean;
	close: () => void;
}

function useMenuFormSubmit({ form, menu, isCreating, close }: UseMenuFormSubmitProps) {
	const { mutate: createMenu } = useMutation(menuMutations.createMenu())
  const { mutate: updateMenu } = useMutation(menuMutations.updateMenu())
  const { mutate: updateMenuWithImage } = useMutation(menuMutations.updateMenuWithImage())

	const [isSubmitting, setIsSubmitting] = useState(false);

	const getPayload = (data: MenuSchema) => {
		return {
      ...data,
      price: Number(data.price?.replaceAll(',', '')),
      description: data.description ?? "",
      menuOptionGroups: [
        ...data.requiredOptionGroups.map((group) => ({
          ...group,
          menuOptions: group.menuOptions.map((option) => ({
            name: option.name,
            price: Number(option.price?.replaceAll(',', '')),
          })),
        })),
        ...data.optionalOptionGroups.map((group) => ({
          ...group,
          menuOptions: group.menuOptions.map((option) => ({
            name: option.name,
            price: Number(option.price?.replaceAll(',', '')),
          })),
        })),
      ],
    }
	}
	
	const handleUpdateMenu = (imageFile: File | null) => {
		const data = form.getValues();

		if (menu?.image === data.image) {
      updateMenu({
        storeId: localStorage.getItem('storeId') as string,
        menuId: menu.menuId,
        data: getPayload(data),
      }, {
        onSuccess: () => {
          toast.success('메뉴가 수정되었습니다.');
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menuDetail(menu.menuId) })
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu })
          close()
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error(errorResponse(error).data.message)
        },
      })
    } else {
      if (!imageFile) return;
      
      updateMenuWithImage({
        storeId: localStorage.getItem('storeId') as string,
        menuId: menu.menuId,
        data: {
          file: imageFile,
          request: getPayload(data),
        },
      }, {
        onSuccess: () => {
          toast.success('메뉴가 수정되었습니다.');
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menuDetail(menu.menuId) })
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu })
          close()
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error(errorResponse(error).data.message)
        },
      })
    }
	}

	const handleCreateMenu = (imageFile: File | null) => {
		if (!imageFile) return;

		createMenu({
        storeId: localStorage.getItem('storeId') as string,
        categoryId: form.getValues('categoryId'),
        data: {
          file: imageFile,
          request: getPayload(form.getValues()),
        },
      }, {
        onSuccess: () => {
          toast.success('메뉴 생성이 완료되었습니다.');
          close()
          queryClient.invalidateQueries({ queryKey: MENUS_KEY.menu })
        },
        onError: (error) => {
          setIsSubmitting(false);
          const { data } = errorResponse(error);

          if (data.code === 'EXCEED_MAXIMUM_MENU_COUNT') {
            form.setError('categoryId', { message: data.message });
            return;
          }

          if (data.code === 'INVALID_DISCOUNT_OPTION_PRICE') {
            form.setError('price', { message: data.message });
            return;
          }

          toast.error(data.message);
        },
      })
	}

	const handleSubmit = (imageFile: File | null) => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		if (isCreating) {
			handleCreateMenu(imageFile);
		} else {
			handleUpdateMenu(imageFile);
		}
	}
	
  return {
		isSubmitting,
		handleSubmit,
  };
}

export default useMenuFormSubmit;