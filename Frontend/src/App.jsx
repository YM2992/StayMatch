import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile"; 
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
