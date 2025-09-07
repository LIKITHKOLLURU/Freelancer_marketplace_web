import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/Footer';
import TopFreelancersSection from '../components/Freelancers';
import apiService from '../services/apiService';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalFreelancers: 0,
    completedProjects: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jobs = await apiService.getAllJobs();
        const leaderboard = await apiService.getLeaderboard();
        const totalCompleted = leaderboard.reduce((sum, freelancer) => sum + freelancer.completedProjects, 0);
        
        setStats({
          totalJobs: jobs.length,
          totalFreelancers: leaderboard.length,
          completedProjects: totalCompleted
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg text-white">
        <h1 className="text-5xl font-bold mb-4">Dynamic Freelancer Marketplace</h1>
        <p className="text-xl mb-6">Where talent meets opportunity through competitive bidding</p>
        <p className="text-lg mb-8 opacity-90">Admins compete for top freelancers • Merit-based leaderboard • Fair market pricing</p>
        
        <div className="flex justify-center space-x-4 mb-8">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-blue-800 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg text-lg"
              >
                Join as Freelancer
              </button>
              <button
                onClick={() => navigate('/register')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-800 font-semibold px-8 py-3 rounded-lg text-lg bg-transparent"
              >
                Join as Admin
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/jobs')}
                className="bg-white text-blue-800 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg text-lg"
              >
                {user?.role === 'freelancer' ? 'Browse Jobs' : 'View Job Board'}
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-800 font-semibold px-8 py-3 rounded-lg text-lg bg-transparent"
              >
                View Leaderboard
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold">{stats.totalJobs}+</div>
            <div className="text-sm opacity-90">Active Jobs</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.totalFreelancers}+</div>
            <div className="text-sm opacity-90">Freelancers</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.completedProjects}+</div>
            <div className="text-sm opacity-90">Completed Projects</div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">How Our Bidding System Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card hover:shadow-lg p-6 rounded-lg border text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">1. Apply for Jobs</h3>
            <p className="text-gray-600">
              Freelancers browse jobs and submit proposals with their desired pricing
            </p>
          </div>
          <div className="card hover:shadow-lg p-6 rounded-lg border text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">2. Admins Compete</h3>
            <p className="text-gray-600">
              Multiple admins can bid on talented freelancers, driving up compensation
            </p>
          </div>
          <div className="card hover:shadow-lg p-6 rounded-lg border text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">3. Build Reputation</h3>
            <p className="text-gray-600">
              Complete projects to climb the leaderboard and attract higher bids
            </p>
          </div>
        </div>
      </section>

      {/* Top Freelancers Section */}
      <TopFreelancersSection />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Home;
