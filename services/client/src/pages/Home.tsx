import SideBar from './components/SideBar';
import Search from './components/Search';

function Home() {
  return (
    <div className="flex w-full">
      <div
        style={{
          width: '10.5%',
        }}
      >
        <SideBar />
      </div>
      <div
        style={{
          width: '88.5%',
        }}
      >
        <Search />
      </div>
    </div>
  );
}

export default Home;
