import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-400"
      : "text-gray-300 hover:text-white";
  };

  return (
    <nav className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                IPL Auction
              </h1>
              <p className="text-xs text-gray-400">Mock Bidding</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <>
                {/* Logged In Menu */}
                <Link
                  to="/dashboard"
                  className={`${isActive("/dashboard")} transition duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-700/50`}
                >
                  Dashboard
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-700/80 rounded-lg hover:from-gray-700/80 hover:to-gray-600 transition-all duration-300 shadow-md">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-gray-600 ring-offset-2 ring-offset-gray-800">
                    <span className="text-white font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-white text-sm font-medium">
                      {user.username}
                    </p>
                    <p className="text-gray-400 text-xs truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-red-900/50 btn-smooth"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Not Logged In Menu */}
                <Link
                  to="/login"
                  className={`${isActive("/login")} transition duration-200 font-medium px-4 py-2 rounded-lg hover:bg-gray-700/50`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-blue-900/50 btn-smooth transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
