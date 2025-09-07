import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    proposedPrice: '',
    proposal: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobs = await apiService.getAllJobs();
        const jobData = jobs.find(j => j._id === id);
        setJob(jobData);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (user.role !== 'freelancer') {
      toast.error('Only freelancers can apply for jobs');
      return;
    }

    setApplying(true);

    try {
      const result = await apiService.createApplication({
        jobId: job._id,
        jobTitle: job.title,
        freelancerId: user._id,
        freelancerName: user.name,
        proposedPrice: parseFloat(applicationData.proposedPrice),
        proposal: applicationData.proposal
      });

      if (result.success) {
        toast.success('Application submitted successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to submit application: ' + error.message);
    } finally {
      setApplying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">Job Not Found</h2>
        <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Job Board
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Job Board
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Job Header */}
        <div className="px-6 py-8 border-b">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Project Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Budget:</span>
                  <span className="font-semibold text-green-600">{job.budget}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Duration:</span>
                  <span className="capitalize">{String(job.duration || '').replace('-', ' ')}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Category:</span>
                  <span className="capitalize">{job.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Level:</span>
                  <span className="capitalize">{job.experienceLevel}</span>
                </div>
                {job?.deadline && (
                  <div className="flex items-center">
                    <span className="w-20 text-gray-500">Deadline:</span>
                    <span className={`${Date.now() > new Date(job.deadline).getTime() ? 'text-red-600 font-semibold' : ''}`}>
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Client Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Posted by:</span>
                  <span>{job.adminName}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Applications:</span>
                  <span>{job.applicationsCount ?? 0} received</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Posted:</span>
                  <span>{job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'recently'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(job.skills)
                ? job.skills
                : String(job.skills || '').split(',').filter(Boolean)
              ).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {String(skill).trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="px-6 py-6 border-b">
          <h3 className="font-semibold text-gray-700 mb-3">Project Description</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* Application Form - Only for Freelancers and only before deadline */}
        {user?.role === 'freelancer' && (
          <div className="px-6 py-6">
            <h3 className="font-semibold text-gray-700 mb-4">Submit Your Application</h3>
            {job?.deadline && Date.now() > new Date(job.deadline).getTime() ? (
              <div className="p-4 bg-gray-100 rounded text-gray-600 text-center">
                Applications Closed
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Proposed Price ($)
                  </label>
                  <input
                    type="number"
                    name="proposedPrice"
                    value={applicationData.proposedPrice}
                    onChange={handleInputChange}
                    placeholder="Enter your price for this project"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter / Proposal
                  </label>
                  <textarea
                    name="proposal"
                    value={applicationData.proposal}
                    onChange={handleInputChange}
                    placeholder="Explain why you're the best fit for this project..."
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {applying ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Admin View Applications Button */}
        {user?.role === 'admin' && user._id === job.adminId && (
          <div className="px-6 py-6 text-center">
            <button
              onClick={() => navigate(`/job/${job._id}/applications`)}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              View Applications ({job.applicationsCount})
            </button>
          </div>
        )}

        {/* Not logged in message */}
        {!user && (
          <div className="px-6 py-6 text-center bg-gray-50">
            <p className="text-gray-600 mb-4">Please log in to apply for this job</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetail;
