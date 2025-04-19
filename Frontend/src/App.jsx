import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Filter from "./pages/Filter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/filter" element={<Filter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
