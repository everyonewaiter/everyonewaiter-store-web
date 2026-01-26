import { mutationOptions } from '@tanstack/react-query';
import { instance } from '@/api';
import type { MenuSchema } from '@/schema/menu.schema';
import type { MoveRequest, PropsWithStoreId } from '@/types/api';
import type { MenuOptionGroup } from '@/types/domain/menu';

export const menuMutations = {
  createMenu: () => mutationOptions({
    mutationFn: async ({ storeId, categoryId, data }: PropsWithStoreId<{ categoryId: string; data: {file: File, request: Omit<MenuSchema, 'image'>} }>) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("request", JSON.stringify(data.request));

      const response = await instance.post(`/stores/${storeId}/categories/${categoryId}/menus`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  }),
  updateMenu: () => mutationOptions({
    mutationFn: async ({ storeId, menuId, data }: PropsWithStoreId<{ menuId: string; data: Omit<MenuSchema, 'categoryId' | 'image' | 'requiredOptionGroups' | 'optionalOptionGroups'> & {menuOptionGroups: Omit<MenuOptionGroup, 'menuOptionGroupId'>[]} }>) => {
      const response = await instance.put(`/stores/${storeId}/menus/${menuId}`, data);
      return response.data;
    },
  }),
  updateMenuWithImage: () => mutationOptions({
    mutationFn: async ({ storeId, menuId, data }: PropsWithStoreId<{ menuId: string; data: {file: File, request: Omit<MenuSchema, 'categoryId' | 'image' | 'requiredOptionGroups' | 'optionalOptionGroups'> & {menuOptionGroups: Omit<MenuOptionGroup, 'menuOptionGroupId'>[]}} }>) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("request", JSON.stringify(data.request));

      const response = await instance.put(`/stores/${storeId}/menus/${menuId}/with-image`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  }),
  deleteMenu: () => mutationOptions({
    mutationFn: async ({ storeId, menuId, categoryId }: PropsWithStoreId<{ menuId: string; categoryId: string }>) => {
      const response = await instance.delete(`/stores/${storeId}/categories/${categoryId}/menus/${menuId}`);
      return response.data;
    },
  }),
  multiDeleteMenus: () => mutationOptions({
    mutationFn: async ({ storeId, data }: PropsWithStoreId<{ data: { menuIds: string[]} }>) => {
      const response = await instance.delete(`/stores/${storeId}/menus/delete`, { data });
      return response.data;
    },
  }),
  moveMenus: () => mutationOptions({
    mutationFn: async ({ storeId, sourceId, targetId, where }: PropsWithStoreId<MoveRequest>) => {
      const response = await instance.post(`/stores/${storeId}/menus/${sourceId}/move/${targetId}`, { where });
      return response.data;
    },
  }),
};
