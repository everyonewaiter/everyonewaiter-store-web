import { Outlet } from 'react-router-dom';

function Layout() {
  return <div className='w-dvw h-dvh bg-white'><Outlet /></div>;
}

export default Layout;