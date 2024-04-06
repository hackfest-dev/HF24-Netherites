import SideBar from './components/SideBar';
import Search from './components/Search';
import { useState } from 'react';

function Home() {
  const [isCollapsed, setisCollapsed] = useState(false)
  return (
    <div className="flex w-full">
      <div
        style={{
          width: isCollapsed ? '5%' : '12%',
          transition: 'width 0.2s ease-in-out',
        }}
      >

        <SideBar setisCollapsed={setisCollapsed} isCollapsed={isCollapsed} />
      </div>
      <div
        style={{
          width: isCollapsed ? '94%' : '87%',
          transition: 'width 0.2s ease-in-out',
        }}
      >
        <Search />
      </div>
    </div>
  );
}

export default Home;
