import { queryOptions } from '@tanstack/react-query';
import { instance } from '@/api';
import { CATEGORY_KEY } from '@/api/categories/keys';
import type { Category } from '@/types/domain/menu';

export const categoryQueries = {
  getCategories: ({ storeId }: { storeId: string }) =>
    queryOptions<{ categories: Category[] }, Error, Category[]>({
      queryKey: CATEGORY_KEY.category(),
      queryFn: async () => {
        const response = await instance.get(`/stores/${storeId}/categories`);
        return response.data;
      },
      enabled: !!storeId,
      select: data => data?.categories
    }),
};
