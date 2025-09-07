import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';

function MyApplications() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || user.role !== 'freelancer') {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const applicationsData = await apiService.getApplicationsByUserId(user._id);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Auto-refresh when tab/window gains focus or visibility changes
    const onFocus = () => fetchApplications();
    const onVisibility = () => { if (document.visibilityState === 'visible') fetchApplications(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user, navigate]);

  const handleAcceptBid = async (applicationId, bidId) => {
    try {
      const result = await apiService.acceptBid(applicationId, bidId);
      if (result.success) {
        toast.success('Bid accepted successfully!');
        // Refresh applications
        const updatedApplications = await apiService.getApplicationsByUserId(user._id);
        setApplications(updatedApplications);
      }
    } catch (error) {
      toast.error('Failed to accept bid: ' + error.message);
    }
  };

  const handleMarkComplete = async (applicationId, freelancerId) => {
    try {
      const result = await apiService.markProjectComplete(applicationId, freelancerId);
      if (result.success) {
        toast.success('Project marked as complete! Your leaderboard ranking has been updated.');
        // Refresh applications
        const updatedApplications = await apiService.getApplicationsByUserId(user._id);
        setApplications(updatedApplications);
      }
    } catch (error) {
      toast.error('Failed to mark project as complete: ' + error.message);
    }
  };

  const getHighestBid = (application) => {
    if (!application.bids || application.bids.length === 0) return null;
    return application.bids.reduce((highest, bid) => 
      bid.amount > highest.amount ? bid : highest
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'bidding': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <div className="flex items-center gap-3">
          <p className="text-gray-600 hidden sm:block">Track your job applications and manage bids</p>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                const applicationsData = await apiService.getApplicationsByUserId(user._id);
                setApplications(applicationsData);
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Yet</h3>
          <p className="text-gray-500 mb-4">You haven't applied for any jobs yet.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => {
            const highestBid = getHighestBid(application);
            
            return (
              <div key={application._id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {application.jobTitle}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Your Proposal:</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{application.proposal}</p>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-50 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-blue-700">
                          Your Price: ${application.proposedPrice}
                        </span>
                      </div>
                    </div>

                    {/* Bids Section */}
                    {application.bids && application.bids.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-3">
                          Bids Received ({application.bids.length})
                        </h4>
                        
                        <div className="space-y-2">
                          {application.bids
                            .sort((a, b) => b.amount - a.amount)
                            .map((bid, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <span className="font-medium text-gray-900">{bid.adminName}</span>
                                <span className="ml-2 text-lg font-bold text-green-600">${bid.amount}</span>
                                <span className="ml-2 text-sm text-gray-500">
                                  {new Date(bid.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {application.status === 'bidding' && (
                                <button
                                  onClick={() => handleAcceptBid(application._id, bid._id)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                                >
                                  Accept Bid
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {highestBid && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-sm font-medium text-green-700">
                              💰 Highest Bid: ${highestBid.amount} from {highestBid.adminName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {application.bids && application.bids.length === 0 && application.status === 'pending' && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="text-sm text-yellow-700">
                          ⏳ Waiting for admins to place bids on your application
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => navigate(`/job/${application.jobId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Job
                  </button>
                  
                  {application.status === 'accepted' && (
                    <button
                      onClick={() => handleMarkComplete(application._id, user._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
