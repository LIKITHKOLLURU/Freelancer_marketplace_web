import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiService from '../services/apiService';

function JobBoard() {
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    experienceLevel: '',
    search: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await apiService.getAllJobs();
        const safeJobs = Array.isArray(jobsData) ? jobsData : [];
        setJobs(safeJobs);
        setFilteredJobs(safeJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job => {
        const skillsText = Array.isArray(job.skills)
          ? job.skills.join(', ')
          : String(job.skills || '');
        return (
          String(job.title || '').toLowerCase().includes(searchLower) ||
          String(job.description || '').toLowerCase().includes(searchLower) ||
          skillsText.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      experienceLevel: '',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Board</h1>
        <p className="text-gray-600">Find your next project opportunity</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Jobs
            </label>
            <input
              type="text"
              placeholder="Search by title, description, or skills..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isClosed = job?.deadline ? (Date.now() > new Date(job.deadline).getTime()) : false;
          return (
          <div key={job._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {(Array.isArray(job.skills)
                    ? job.skills
                    : String(job.skills || '').split(',').filter(Boolean)
                  ).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="capitalize">📂 {job.category}</span>
                  <span className="capitalize">⏱️ {String(job.duration || '').replace('-', ' ')}</span>
                  <span className="capitalize">🎯 {job.experienceLevel}</span>
                  <span>👥 {job.applicationsCount ?? 0} applications</span>
                  {job?.deadline && (
                    <span className={`${isClosed ? 'text-red-600' : 'text-gray-500'}`}>
                      🗓️ Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-6 text-right">
                <div className="text-2xl font-bold text-green-600 mb-2">{job.budget}</div>
                <div className="text-sm text-gray-500 mb-3">
                  Posted by {job.adminName || 'Admin'}
                </div>
                
                {user?.role === 'freelancer' ? (
                  isClosed ? (
                    <span className="inline-block px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed">
                      Applications Closed
                    </span>
                  ) : (
                    <Link
                      to={`/job/${job._id}`}
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </Link>
                  )
                ) : user?.role === 'admin' && user._id === job.adminId ? (
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      to={`/job/${job._id}/applications`}
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this job? This will hide it from everyone.')) return;
                        try {
                          const res = await apiService.deleteJob(job._id);
                          if (res?.success) {
                            setJobs(prev => prev.filter(j => j._id !== job._id));
                            setFilteredJobs(prev => prev.filter(j => j._id !== job._id));
                          }
                        } catch (e) {
                          console.error(e);
                          alert('Failed to delete job');
                        }
                      }}
                      className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">View Only</span>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Posted {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'recently'}
            </div>
          </div>
        )})}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}

export default JobBoard;
