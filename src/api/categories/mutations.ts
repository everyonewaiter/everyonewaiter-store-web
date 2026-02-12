import { mutationOptions } from '@tanstack/react-query';
import { instance } from '@/api';
import type { MoveRequest } from '@/types/api';
import type { Category } from '@/types/domain/menu';

export const categoryMutations = {
  createCategory: () => mutationOptions({
    mutationFn: async ({ storeId, data }: { storeId: string; data: Pick<Category, 'name'> }) => {
      const response = await instance.post(`/stores/${storeId}/categories`, data);
      return response.data;
    },
  }),
  updateCategory: () => mutationOptions({
    mutationFn: async ({storeId, categoryId, data}: {storeId: string; categoryId: string; data: Pick<Category, 'name'> }) => {
      const response = await instance.put(`/stores/${storeId}/categories/${categoryId}`, data);
      return response.data;
    },
  }),
  deleteCategory: () => mutationOptions({
    mutationFn: async ({storeId, categoryId}: {storeId: string; categoryId: string}) => {
      const response = await instance.delete(`/stores/${storeId}/categories/${categoryId}`);
      return response.data;
    },
  }),
  moveCategories: () => mutationOptions({
    mutationFn: async ({ storeId, sourceId, targetId, where }: { storeId: string; } & MoveRequest) => {
      const response = await instance.post(`/stores/${storeId}/categories/${sourceId}/move/${targetId}`, { where });
      return response.data;
    },
  }),
};
