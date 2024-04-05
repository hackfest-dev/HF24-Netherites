

import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
import { SideBar } from "./pages/layout/side-bar";
import NotFound from "./pages/NotFound";

function App() {


  return (
    <Routes>

      <Route path="*" element={<NotFound />} />

      <Route path='/' element={<SideBar />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/discovery" element={<div>Discovery</div>} />
      </Route>



    </Routes>
  )
}

export default App
