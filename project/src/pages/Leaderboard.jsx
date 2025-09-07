import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Leaderboard</h1>
        <p className="text-gray-600">Top performers ranked by completed projects</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Freelancer</div>
            <div className="col-span-3">Completed Projects</div>
            <div className="col-span-4">Skills</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {leaderboard.map((freelancer) => (
            <div
              key={freelancer._id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                freelancer.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <div className="flex items-center">
                    {freelancer.rank === 1 && (
                      <span className="text-2xl mr-2">🥇</span>
                    )}
                    {freelancer.rank === 2 && (
                      <span className="text-2xl mr-2">🥈</span>
                    )}
                    {freelancer.rank === 3 && (
                      <span className="text-2xl mr-2">🥉</span>
                    )}
                    <span className={`font-bold ${
                      freelancer.rank <= 3 ? 'text-yellow-700' : 'text-gray-700'
                    }`}>
                      #{freelancer.rank}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{freelancer.name}</h3>
                    <p className="text-sm text-gray-500">@{freelancer.username}</p>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {freelancer.completedProjects}
                    </span>
                    <span className="ml-2 text-gray-500">projects</span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {freelancer.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{freelancer.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>No freelancers found on the leaderboard yet.</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Rankings are updated in real-time based on completed project count</p>
      </div>
    </div>
  );
}

export default Leaderboard;
