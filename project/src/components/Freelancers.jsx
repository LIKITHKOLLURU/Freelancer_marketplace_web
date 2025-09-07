// src/components/FreelancersSection.jsx
function FreelancersSection() {
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
  ];

  const renderStars = (rating) => (
    <div className="flex justify-center mt-2">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
    </div>
  );

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Meet Our Expert Freelancers</h2>
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
            {renderStars(freelancer.rating)}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FreelancersSection;
