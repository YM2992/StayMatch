import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Filter from "./pages/Filter";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Main from "./pages/Main";

function NonAuthProtectedRoute({ children, redirectTo }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return <Navigate to={redirectTo} />;
  }

  return children;
}

function AuthProtectedRoute({ children, redirectTo }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || (user && !user.token)) {
    return <Navigate to={redirectTo} />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={
            <NonAuthProtectedRoute redirectTo="/filter">
              <Home />
            </NonAuthProtectedRoute>
          }
        />
        <Route path="/registration" element={
            <NonAuthProtectedRoute redirectTo="/filter">
              <Registration />
            </NonAuthProtectedRoute>
          }
        />
        <Route path="/filter" element={
            <AuthProtectedRoute redirectTo="/">
              <Filter />
            </AuthProtectedRoute>
          }
        />
        <Route path="/profile" element={
            <AuthProtectedRoute redirectTo="/">
              <Profile />
            </AuthProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/main" element={
            <AuthProtectedRoute redirectTo="/">
              <Main />
            </AuthProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
