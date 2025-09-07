import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';
import JOB_CATEGORIES from '../constants/categories';

function PostJob() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    skills: '',
    category: '',
    experienceLevel: 'intermediate',
    projectType: 'fixed',
    deadline: '', // ISO date string (yyyy-mm-dd or datetime-local)
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        // Ensure deadline is formatted as ISO string if provided
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        clientId: user?._id,
        clientName: user?.name || user?.username
      };

      const result = await apiService.createJob(jobData);
      
      if (result.success) {
        toast.success('Job posted successfully!');
        navigate('/jobs');
      }
    } catch (error) {
      toast.error('Failed to post job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="e.g. Need React Developer for E-commerce Project"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input-field"
            />
            <p className="mt-1 text-sm text-gray-500">After the deadline, applications will be closed automatically.</p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select a category</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              required
              placeholder="Describe your project requirements, goals, and expectations"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. $500-1000"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Project Duration
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select duration</option>
                <option value="less-than-1-month">Less than 1 month</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="more-than-6-months">More than 6 months</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, TypeScript"
              className="input-field"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate skills with commas
            </p>
          </div>

          <button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
