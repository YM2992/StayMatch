import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";
import homeIcon from "../assets/home-icon.svg";
import profileIcon from "../assets/profile-icon.svg";
import toast from "react-hot-toast";

function NavBar() {
  const { authDetails, clearAuthDetails } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthDetails();
    navigate("/");
    toast.success("Logged out successfully! 👋");
  };

  return (
    <nav className="bg-gray-100 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/filter" className="flex items-center space-x-2">
          <img src={homeIcon} alt="Home" className="h-6 w-6" />
          <span className="text-lg font-semibold text-gray-700">StayMatch</span>
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        {authDetails ? (
          <>
            <Link to="/profile" className="flex items-center space-x-2">
              <img src={profileIcon} alt="Profile" className="h-6 w-6" />
              <span className="text-gray-700">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              Login
            </Link>
            <Link
              to="/registration"
              className="text-sm text-blue-600 hover:underline"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;