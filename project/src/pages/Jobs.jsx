import { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function Jobs() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const [jobs] = useState([
    {
      id: 1,
      title: "React Developer Needed",
      description: "Looking for an experienced React developer for a 3-month project. Must have experience with modern React practices, TypeScript, and state management.",
      budget: "$3000-5000",
      category: "Development",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      postedDate: "2024-02-15",
      proposals: 4,
      status: "open"
    },
    {
      id: 2,
      title: "Full Stack Developer for E-commerce Project",
      description: "Need a full stack developer to build an e-commerce platform. Experience with Node.js and React required.",
      budget: "$5000-8000",
      category: "Development",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      postedDate: "2024-02-16",
      proposals: 6,
      status: "open"
    },
    {
      id: 3,
      title: "UI/UX Designer for Mobile App",
      description: "Seeking a talented UI/UX designer for our mobile app redesign project. Must have experience with Figma and mobile design principles.",
      budget: "$2000-4000",
      category: "Design",
      skills: ["UI/UX", "Figma", "Mobile Design"],
      postedDate: "2024-02-17",
      proposals: 3,
      status: "open"
    },
    {
      id: 4,
      title: "Backend Developer for API Integration",
      description: "Require a backend developer to integrate multiple third-party APIs. Proficiency in Python and FastAPI is a must.",
      budget: "$1500-2500",
      category: "Development",
      skills: ["Python", "FastAPI", "REST APIs"],
      postedDate: "2024-02-18",
      proposals: 5,
      status: "open"
    },
    {
      id: 5,
      title: "WordPress Expert Needed",
      description: "Looking for a WordPress expert to customize a theme and enhance SEO. Prior experience with Elementor is preferred.",
      budget: "$500-1000",
      category: "Development",
      skills: ["WordPress", "Elementor", "SEO"],
      postedDate: "2024-02-19",
      proposals: 8,
      status: "open"
    },
    {
      id: 6,
      title: "DevOps Engineer for CI/CD Pipeline",
      description: "Build and maintain a CI/CD pipeline using Jenkins and Docker. AWS experience is a plus.",
      budget: "$4000-6000",
      category: "Development",
      skills: ["Jenkins", "Docker", "AWS", "CI/CD"],
      postedDate: "2024-02-20",
      proposals: 2,
      status: "open"
    },
    {
      id: 7,
      title: "Content Writer for Tech Blog",
      description: "We need a content writer with technical knowledge to write blog posts about web development and new technologies.",
      budget: "$200-500",
      category: "Marketing",
      skills: ["Content Writing", "Technical Writing", "SEO"],
      postedDate: "2024-02-21",
      proposals: 10,
      status: "open"
    },
    {
      id: 8,
      title: "Data Analyst Needed",
      description: "Analyze large datasets and prepare reports using Excel and Power BI. Prior experience required.",
      budget: "$1000-2000",
      category: "Marketing",
      skills: ["Excel", "Power BI", "Data Analysis"],
      postedDate: "2024-02-22",
      proposals: 3,
      status: "open"
    },
    {
      id: 9,
      title: "Mobile App Developer for Android",
      description: "Looking for an Android developer to build a food delivery app. Kotlin experience is mandatory.",
      budget: "$3000-5000",
      category: "Development",
      skills: ["Android", "Kotlin", "Firebase"],
      postedDate: "2024-02-23",
      proposals: 7,
      status: "open"
    }
  ]);

  const handleApply = (jobId) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Submitting your application...',
        success: 'Application submitted successfully!',
        error: 'Error submitting application.',
      }
    );
  };

  // Filtering logic
  const filteredJobs = jobs.filter(job => {
    const categoryMatch = !selectedCategory || job.category === selectedCategory;
    const budgetMatch = !selectedBudget || (() => {
      const [minBudget, maxBudget] = job.budget.replace('$', '').split('-').map(Number);
      if (selectedBudget === '0-1000') return maxBudget <= 1000;
      if (selectedBudget === '1000-5000') return minBudget >= 1000 && maxBudget <= 5000;
      if (selectedBudget === '5000+') return minBudget >= 5000;
      return true;
    })();
    return categoryMatch && budgetMatch;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field px-4 py-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="input-field px-4 py-2 border rounded"
          >
            <option value="">Budget Range</option>
            <option value="0-1000">$0 - $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000+">$5,000+</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="card hover:shadow-lg transition-shadow p-6 border rounded">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                </div>
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm">
                  {job.budget}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div>Posted {format(new Date(job.postedDate), 'MMM dd, yyyy')}</div>
                <div>{job.proposals} proposals</div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleApply(job.id)}
                  className="btn-primary"
                >
                  Apply Now
                </button>
                <button className="text-gray-600 hover:text-black">
                  Save Job
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No jobs match the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default Jobs;
