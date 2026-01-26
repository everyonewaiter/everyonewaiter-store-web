import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryQueries } from '@/api/categories/queries';
import { menuQueries } from '@/api/menus/queries';

function useMenu() {
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const storeId = localStorage.getItem('storeId') as string;
  const getCategories = useQuery(categoryQueries.getCategories({ storeId }))
  const getMenus = useQuery(menuQueries.getMenus({ storeId, categoryId: selectedCategory ?? "" }))

	return {
		storeId,
		selectedCategory,
		setSelectedCategory,
		getCategories,
		getMenus,
	}
}

export default useMenu;