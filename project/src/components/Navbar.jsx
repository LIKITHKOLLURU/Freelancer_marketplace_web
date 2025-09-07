import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FaUserCircle } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavigation = (path) => {
    const protectedPaths = ['/freelancers', '/jobs', '/post-job', '/profile'];
    if (!isAuthenticated && protectedPaths.includes(path)) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-black">
            <img src="/image.jpg" alt="Logo" className="h-8 w-8 rounded-full" />
            <span>Freelance Marketplace</span>
          </Link>

          {/* Navigation Buttons */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => handleNavigation('/jobs')} className="text-gray-600 hover:text-black">Job Board</button>
            <button onClick={() => handleNavigation('/leaderboard')} className="text-gray-600 hover:text-black">Leaderboard</button>
            {user?.role === 'admin' && (
              <button onClick={() => handleNavigation('/post-job')} className="text-gray-600 hover:text-black">Post Job</button>
            )}
            {user?.role === 'freelancer' && (
              <button onClick={() => handleNavigation('/my-applications')} className="text-gray-600 hover:text-black">My Applications</button>
            )}
          </div>

          {/* Auth Buttons / Dropdown */}
          <div className="flex items-center space-x-4 relative">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-primary">Login</Link>
                <Link to="/register" className="text-black hover:text-gray-700">Register</Link>
              </>
            ) : (
              <>
                <button onClick={toggleDropdown} className="text-3xl focus:outline-none">
                  <FaUserCircle />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white shadow-md rounded w-64 z-50">
                    <div className="p-3 border-b">
                      <div className="font-semibold text-sm">{user?.username || 'User'}</div>
                      <div className="text-xs text-gray-500">{user?.role || 'Freelancer'}</div>
                    </div>
                    <ul className="p-2 space-y-2">
                      <li
                        onClick={() => navigate('/profile')}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        My Profile
                      </li>
                      <li
                        onClick={() => navigate('/dashboard')}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        Dashboard
                      </li>
                      {user?.role === 'freelancer' && (
                        <li
                          onClick={() => navigate('/my-applications')}
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                        >
                          My Applications
                        </li>
                      )}
                      <li
                        onClick={() => navigate('/notifications')}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        Notifications
                      </li>
                      <li
                        onClick={() => navigate('/settings')}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        Settings
                      </li>
                      <li
                        onClick={handleLogout}
                        className="cursor-pointer hover:bg-black hover:text-white p-2 rounded text-white bg-black"
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
