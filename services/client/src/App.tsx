import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import Layout from './pages/components/Layout';
import DiscoverPage from './pages/DiscoverPage';
import io from "socket.io-client"
import { useEffect } from 'react';

//@ts-ignore
const socket = io.connect("http://localhost:5003")


function App() {
  const sendMessage = () => {
    socket.emit()
  }

  useEffect(() => {
    sendMessage()
  }, [])

  return (
    <main
      style={{
        backgroundColor: '#202222',
      }}
      className="h-screen w-screen"
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
        </Route>
      </Routes>

    </main>
  );
}

export default App;
