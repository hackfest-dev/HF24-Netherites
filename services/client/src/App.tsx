import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

function App() {
  return (
    <main
      style={{
        backgroundColor: '#202222',
      }}
      className="h-screen w-screen"
    >
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
  );
}

export default App;
