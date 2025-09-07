import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [myJobs, setMyJobs] = useState([]); // for admins
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) {
        // No user available; stop loading to avoid infinite spinner
        setLoading(false);
        return;
      }
      if (user?._id) {
        try {
          setLoading(true);
          
          if (user.role === 'admin') {
            // Admin (hirer): fetch all jobs and filter by adminId
            const jobs = await apiService.getAllJobs();
            setMyJobs((jobs || []).filter(j => j.adminId === user._id));
            // Notifications still user-scoped
            const userNotifications = await apiService.getNotificationsByUserId(user._id);
            setNotifications(userNotifications);
          } else {
            // Freelancer: applications, notifications, earnings
            const userApplications = await apiService.getApplicationsByUserId(user._id);
            setApplications(userApplications);
            const userNotifications = await apiService.getNotificationsByUserId(user._id);
            setNotifications(userNotifications);
            const userEarnings = await apiService.getEarningsByUserId(user._id);
            setEarnings(userEarnings.total);
          }
          
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    // Auto-refresh on window focus
    const onFocus = () => fetchDashboardData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user]);

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    // Mock upload functionality
    setUploadStatus('Uploading...');
    setTimeout(() => {
      setUploadStatus('Resume uploaded successfully!');
      setUploadedResumeUrl('#'); // Mock URL
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?._id && !loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={async () => {
            try {
              setLoading(true);
              // re-run same fetch logic quickly for both roles
              if (user.role === 'admin') {
                const jobs = await apiService.getAllJobs();
                setMyJobs((jobs || []).filter(j => j.adminId === user._id));
                const userNotifications = await apiService.getNotificationsByUserId(user._id);
                setNotifications(userNotifications);
              } else {
                const userApplications = await apiService.getApplicationsByUserId(user._id);
                setApplications(userApplications);
                const userNotifications = await apiService.getNotificationsByUserId(user._id);
                setNotifications(userNotifications);
                const userEarnings = await apiService.getEarningsByUserId(user._id);
                setEarnings(userEarnings.total);
              }
            } finally {
              setLoading(false);
            }
          }}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {user?.role === 'admin' ? (
        <>
          {/* Admin Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">Welcome</h2>
              <p className="mt-2 text-gray-600">{user?.name || 'Admin'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">My Posted Jobs</h2>
              <p className="mt-2 text-purple-600 font-bold text-lg">{myJobs.length}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">Total Applications</h2>
              <p className="mt-2 text-blue-600 font-bold text-lg">{myJobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0)}</p>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <Link to="/post-job" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Post a Job</Link>
          </div>

          {/* My Posted Jobs */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">My Posted Jobs</h2>
            {myJobs.length === 0 ? (
              <p className="text-gray-500">You haven't posted any jobs yet.</p>
            ) : (
              <ul className="divide-y">
                {myJobs.map(job => (
                  <li key={job._id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.applicationsCount || 0} applications</p>
                    </div>
                    <Link
                      to={`/job/${job._id}/applications`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Applications
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Freelancer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">Welcome</h2>
              <p className="mt-2 text-gray-600">{user?.username || user?.name || 'User'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">Earnings</h2>
              <p className="mt-2 text-green-600 font-bold text-lg">₹{earnings}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">Applications</h2>
              <p className="mt-2 text-blue-600 font-bold text-lg">{applications.length}</p>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
            {applications.length === 0 ? (
              <p className="text-gray-500">No applications submitted yet.</p>
            ) : (
              <ul className="space-y-2">
                {applications.slice(0, 5).map((app, index) => (
                  <li key={index} className="border-b py-2">
                    <span className="font-semibold">{app.jobTitle}</span> - {app.status}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No new notifications.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.slice(0, 5).map((note, index) => (
                  <li key={index} className="text-gray-700">{note.message}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Resume Upload Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="mb-4 block"
            />
            <button
              onClick={handleResumeUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Resume
            </button>
            {uploadStatus && <p className="mt-2 text-sm text-gray-700">{uploadStatus}</p>}
            {uploadedResumeUrl && (
              <p className="mt-2 text-sm">
                Download Resume:{" "}
                <a
                  href={uploadedResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Click here
                </a>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
