import { useState } from 'react';
import type { Menu } from '@/types/domain/menu';

function useCheckMenu() {
	const [checkedMenus, setCheckedMenus] = useState<Menu[]>([]);

	const toggleCheckMenu = (menu: Menu) => {
		if (checkedMenus.includes(menu)) {
      setCheckedMenus(checkedMenus.filter((m) => m.menuId !== menu.menuId));
    } else {
      setCheckedMenus([...checkedMenus, menu]);
    }
	}

	return {
		checkedMenus,
		toggleCheckMenu,
		resetCheckedMenus: () => setCheckedMenus([]),
	}
}

export default useCheckMenu;