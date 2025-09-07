import React, { useState } from 'react';

const freelancers = [
  {
    name: 'Aarav Patel',
    title: 'Full-Stack Developer',
    image: '/profile1.jpg',
    skills: 'React, Node.js, MongoDB',
    rating: 5,
  },
  {
    name: 'Meera Sharma',
    title: 'UI/UX Designer',
    image: '/profile2.jpg',
    skills: 'Figma, Adobe XD, Prototyping',
    rating: 4,
  },
  {
    name: 'Rohit Singh',
    title: 'Mobile App Developer',
    image: '/profile3.jpg',
    skills: 'Flutter, Kotlin, Swift',
    rating: 4,
  },
  {
    name: 'Sara Thomas',
    title: 'Data Scientist',
    image: '/profile4.jpg',
    skills: 'Python, Machine Learning, Pandas',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    title: 'Backend Developer',
    image: '/profile5.jpg',
    skills: 'Java, Spring Boot, PostgreSQL',
    rating: 4,
  },
  {
    name: 'Priya Verma',
    title: 'Digital Marketing Specialist',
    image: '/profile6.jpg',
    skills: 'SEO, Google Ads, Social Media Marketing',
    rating: 5,
  },
  {
    name: 'Ankit Yadav',
    title: 'DevOps Engineer',
    image: '/profile7.jpg',
    skills: 'Docker, Kubernetes, AWS',
    rating: 4,
  },
  {
    name: 'Nisha Mehta',
    title: 'Content Writer',
    image: '/profile8.jpg',
    skills: 'SEO Content, Copywriting, Blogging',
    rating: 4,
  },
  {
    name: 'Vishal Gupta',
    title: 'Web Developer',
    image: '/profile9.jpg',
    skills: 'HTML, CSS, JavaScript',
    rating: 5,
  },
  {
    name: 'Rina Singh',
    title: 'QA Engineer',
    image: '/profile10.jpg',
    skills: 'Manual Testing, Automation, Selenium',
    rating: 4,
  },
  {
    name: 'Maya Reddy',
    title: 'Graphic Designer',
    image: '/profile11.jpg',
    skills: 'Illustrator, Photoshop, Branding',
    rating: 5,
  },
  {
    name: 'Karan Bhatia',
    title: 'Cloud Architect',
    image: '/profile12.jpg',
    skills: 'AWS, Azure, Google Cloud',
    rating: 4,
  },
];

const renderStars = (count) => {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
};

function Freelancers() {
  const [hiredIndex, setHiredIndex] = useState(null);

  const handleHire = (index) => {
    setHiredIndex(index);
    setTimeout(() => setHiredIndex(null), 2000);
  };

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Explore Our Freelancers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {freelancers.map((freelancer, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 text-center">
            <img
              src={freelancer.image}
              alt={freelancer.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900">{freelancer.name}</h3>
            <p className="text-sm text-gray-600">{freelancer.title}</p>
            <p className="text-sm text-gray-500 mt-2">{freelancer.skills}</p>
            <div className="mt-2 text-yellow-500 text-sm">{renderStars(freelancer.rating)}</div>
            <button
              onClick={() => handleHire(index)}
              className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Hire
            </button>
            {hiredIndex === index && (
              <p className="mt-2 text-black font-semibold">Hiring Requested!</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Freelancers;
