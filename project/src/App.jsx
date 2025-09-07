import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import JobApplications from './pages/JobApplications';
import MyApplications from './pages/MyApplications';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import Leaderboard from './pages/Leaderboard';
import PrivateRoute from './components/PrivateRoute';
import UserProfile from './pages/UserProfile';
import Freelancers from './pages/Freelancers';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  const { isAuthenticated, role } = useSelector(state => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/job/:id/applications" element={<JobApplications />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/freelancers" element={<Freelancers />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />

            <Route
              path="/post-job"
              element={
                <PrivateRoute roles={['admin']}>
                  <PostJob />
                </PrivateRoute>
              }
            />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
