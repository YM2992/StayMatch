import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile"; 
<<<<<<< HEAD
import ForgotPassword from "./pages/ForgotPassword";
=======
>>>>>>> bbe6ba77a087d933646411331265610ef2ecf9cc

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
<<<<<<< HEAD
        <Route path="/forgot-password" element={<ForgotPassword />} />
=======
>>>>>>> bbe6ba77a087d933646411331265610ef2ecf9cc
      </Routes>
    </BrowserRouter>
  );
}

export default App;
