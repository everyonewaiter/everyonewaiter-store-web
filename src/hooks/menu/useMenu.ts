import { useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { categoryQueries } from '@/api/categories/queries';
import { menuQueries } from '@/api/menus/queries';

function useMenu() {
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const storeId = localStorage.getItem('storeId') as string;
	const getCategories = useQuery(categoryQueries.getCategories({ storeId }))
	const getMenus = useQuery(menuQueries.getMenus({ storeId, categoryId: selectedCategory ?? "" }))

	const allMenusQueries = useQueries({
		queries: getCategories.data?.map(category => 
			menuQueries.getMenus({ storeId, categoryId: category.categoryId })
		) ?? [],
	})

	const allMenus = selectedCategory === 'all' 
		? allMenusQueries.flatMap(query => query.data ?? [])
		: getMenus.data?.filter((menu) => menu.categoryId === selectedCategory)

	return {
		storeId,
		selectedCategory,
		setSelectedCategory,
		getCategories,
		allMenus,
	}
}

export default useMenu;