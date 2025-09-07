import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';

function JobApplications() {
  const { id } = useParams(); // job ID
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidsByApp, setBidsByApp] = useState({}); // { [applicationId]: [bids] }
  const [bidInputs, setBidInputs] = useState({}); // { [applicationId]: amount }
  // Simplified flow: no bidding

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const jobs = await apiService.getAllJobs();
        const jobData = jobs.find(j => j._id === id);
        setJob(jobData);

        if (!jobData) {
          toast.error('Job not found');
          navigate('/jobs');
          return;
        }

        // Access check: allow any admin to view and bid; only owner can accept
        if (user?.role !== 'admin') {
          toast.error('Access denied');
          navigate('/jobs');
          return;
        }

        // Fetch applications for this job
        const applicationsData = await apiService.getApplicationsByJobId(id);
        setApplications(applicationsData);

        // Fetch bids for each application (admin view)
        const bidsMap = {};
        for (const app of applicationsData) {
          try {
            const bids = await apiService.getBidsByApplicationId(app._id);
            bidsMap[app._id] = bids;
          } catch (_) {
            bidsMap[app._id] = [];
          }
        }
        setBidsByApp(bidsMap);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [id, user, navigate]);

  const handlePlaceBid = async (application) => {
    try {
      if (!bidInputs[application._id]) {
        toast.error('Enter a bid amount');
        return;
      }
      const amount = Number(bidInputs[application._id]);
      if (Number.isNaN(amount) || amount <= 0) {
        toast.error('Invalid bid amount');
        return;
      }
      const payload = {
        applicationId: application._id,
        jobId: id,
        freelancerId: application.freelancerId,
        adminId: user._id,
        adminName: user.name || user.username || 'Admin',
        amount,
      };
      const res = await apiService.placeBid(payload);
      if (res?.success) {
        toast.success('Bid placed');
        const bids = await apiService.getBidsByApplicationId(application._id);
        setBidsByApp(prev => ({ ...prev, [application._id]: bids }));
      } else {
        toast.error(res?.message || 'Failed to place bid');
      }
    } catch (e) {
      toast.error('Failed to place bid: ' + e.message);
    }
  };

  const handleAcceptBid = async (applicationId, bidId) => {
    try {
      const res = await apiService.acceptBid(applicationId, bidId);
      if (res?.success) {
        toast.success('Bid accepted');
        // refresh bids and applications
        const [bids, apps] = await Promise.all([
          apiService.getBidsByApplicationId(applicationId),
          apiService.getApplicationsByJobId(id)
        ]);
        setBidsByApp(prev => ({ ...prev, [applicationId]: bids }));
        setApplications(apps);
      } else {
        toast.error(res?.message || 'Failed to accept bid');
      }
    } catch (e) {
      toast.error('Failed to accept bid: ' + e.message);
    }
  };

  const handleAcceptApplication = async (applicationId) => {
    try {
      const res = await apiService.acceptApplication(applicationId);
      if (res?.success) {
        toast.success('Application accepted');
        const updatedApplications = await apiService.getApplicationsByJobId(id);
        setApplications(updatedApplications);
      } else {
        toast.error(res?.message || 'Failed to accept');
      }
    } catch (error) {
      toast.error('Failed to accept: ' + error.message);
    }
  };

  // Bidding removed for simplified flow

  // Bidding helpers removed

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">Job not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Job Board
        </button>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <p className="text-gray-600 mb-4">{job.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Budget: {job.budget}</span>
            <span>Duration: {job.duration}</span>
            <span>Applications: {applications.length}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Applications ({applications.length})
        </h2>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Yet</h3>
          <p className="text-gray-500">This job hasn't received any applications yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {application.freelancerName}
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Proposal:</h4>
                    <p className="text-gray-600 leading-relaxed">{application.proposal}</p>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-blue-700">
                        Proposed: ${application.proposedPrice}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      application.status === 'bidding' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Status: {application.status}
                    </div>
                  </div>

                  {/* Bidding */}
                  {user?.role === 'admin' && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Bids</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="number"
                          min="1"
                          value={bidInputs[application._id] || ''}
                          onChange={(e) => setBidInputs(prev => ({ ...prev, [application._id]: e.target.value }))}
                          className="border rounded px-2 py-1 w-40"
                          placeholder="Enter amount"
                        />
                        <button
                          onClick={() => handlePlaceBid(application)}
                          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Place Bid
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(bidsByApp[application._id] || []).length === 0 ? (
                          <p className="text-sm text-gray-500">No bids yet.</p>
                        ) : (
                          (bidsByApp[application._id] || []).map((bid) => (
                            <div key={bid._id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">{bid.adminName}</span> bid <span className="font-semibold">${bid.amount}</span>
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                  bid.status === 'accepted' ? 'bg-green-100 text-green-700' : bid.status === 'outbid' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {bid.status}
                                </span>
                              </div>
                              {bid.status === 'active' && (
                                <button
                                  onClick={() => handleAcceptBid(application._id, bid._id)}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  Accept Bid
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-3 pl-4">
                  <button
                    onClick={() => navigate(`/profile/${application.freelancerId}`)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    View Profile
                  </button>

                  {application.status === 'pending' && user._id === job.adminId ? (
                    <button
                      onClick={() => handleAcceptApplication(application._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Accept Application
                    </button>
                  ) : (
                    <div className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium text-center">
                      Accepted
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobApplications;
