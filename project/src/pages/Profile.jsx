import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiService from '../services/apiService';

function Profile() {
  const { user: authUser } = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // Prefill with safe defaults; will be replaced by logged-in user data below
  const [name, setName] = useState('');
  const [bio, setBio] = useState(
    'Experienced professional. Add a short bio about your expertise and interests.'
  );

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [isEditingWork, setIsEditingWork] = useState(false);
  const [work, setWork] = useState({
    title: 'Recent Project',
    date: '',
    description: 'Describe one of your recent projects or accomplishments.'
  });

  const [isEditingCerts, setIsEditingCerts] = useState(false);
  const [certs, setCerts] = useState([]);

  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [education, setEducation] = useState({
    degree: '',
    college: ''
  });

  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [testimonial, setTestimonial] = useState('');

  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [availability, setAvailability] = useState('');

  // Load the logged-in user's data (from Redux and optionally refetch from backend)
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!authUser) return;
        // Start from the Redux user
        const baseUser = authUser;
        // Try to refresh from backend if we have an _id
        let latest = baseUser;
        if (baseUser?._id) {
          try {
            const fresh = await apiService.getUserById(baseUser._id);
            if (fresh) latest = fresh;
          } catch (_) {
            // swallow fetch errors; keep Redux user
          }
        }

        setName(latest?.name || latest?.username || '');
        setSkills(Array.isArray(latest?.skills) ? latest.skills : []);
        // Optional fields not in backend schema; keep defaults unless present
        if (latest?.bio) setBio(latest.bio);
        if (typeof latest?.availability === 'string') setAvailability(latest.availability);
        if (Array.isArray(latest?.certs)) setCerts(latest.certs);
        if (latest?.education) setEducation(latest.education);
      } catch (e) {
        // no-op
      }
    };
    loadUser();
  }, [authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opacity-5 p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Profile</h1>

      {/* Profile Header */}
      <div className="card mb-8 p-6 bg-white rounded-lg shadow">
        <div className="flex items-start gap-8">
          <div className="relative w-32 h-32">
            <label htmlFor="profileImage">
              <img
                src={profileImage || "https://via.placeholder.com/128x128?text=Profile"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover cursor-pointer border hover:opacity-80"
              />
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            {isEditingProfile ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-semibold mb-2 w-full border px-2 py-1 rounded"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-gray-700 mb-4 border px-2 py-1 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-2">{name || 'User'}</h2>
                <p className="text-gray-600 mb-1">{authUser?.email}</p>
                <p className="text-gray-600 mb-4 capitalize">{authUser?.role}</p>
                <p className="text-gray-700 mb-4">{bio}</p>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="btn-primary bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid gap-8">

        {/* Skills */}
        <div className="card p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Skills</h3>
            <button onClick={() => setIsEditingSkills(!isEditingSkills)} className="text-sm text-blue-600 hover:underline">
              {isEditingSkills ? "Cancel" : "Edit"}
            </button>
          </div>
          {isEditingSkills ? (
            <>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="border rounded px-2 py-1"
                  placeholder="Add skill"
                />
                <button onClick={addSkill} className="bg-black text-white px-3 py-1 rounded">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                    {skill}
                    <button onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="ml-2 text-red-500">×</button>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(skills && skills.length > 0 ? skills : ['Add some skills']).map((skill, i) => (
                <span key={`${skill}-${i}`} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          )}
        </div>

        {/* Work History */}
        <div className="card p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Work History</h3>
            <button onClick={() => setIsEditingWork(!isEditingWork)} className="text-sm text-blue-600 hover:underline">
              {isEditingWork ? "Cancel" : "Edit"}
            </button>
          </div>
          {isEditingWork ? (
            <>
              <input
                className="w-full border px-2 py-1 mb-2"
                value={work.title}
                onChange={(e) => setWork({ ...work, title: e.target.value })}
              />
              <input
                className="w-full border px-2 py-1 mb-2"
                value={work.date}
                onChange={(e) => setWork({ ...work, date: e.target.value })}
              />
              <textarea
                className="w-full border px-2 py-1"
                value={work.description}
                onChange={(e) => setWork({ ...work, description: e.target.value })}
              />
            </>
          ) : (
            <div className="border-b pb-4">
              <h4 className="font-semibold">{work.title}</h4>
              {work.date && <p className="text-gray-600">{work.date}</p>}
              <p className="text-gray-700 mt-2">{work.description}</p>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="card p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Certifications</h3>
            <button onClick={() => setIsEditingCerts(!isEditingCerts)} className="text-sm text-blue-600 hover:underline">
              {isEditingCerts ? "Cancel" : "Edit"}
            </button>
          </div>
          {isEditingCerts ? (
            <ul className="space-y-2">
              {certs.map((cert, i) => (
                <li key={i}>
                  <input
                    className="w-full border px-2 py-1"
                    value={cert}
                    onChange={(e) => {
                      const updated = [...certs];
                      updated[i] = e.target.value;
                      setCerts(updated);
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {(certs && certs.length > 0 ? certs : []).map((cert, i) => <li key={i}>{cert}</li>)}
              {(!certs || certs.length === 0) && <li className="text-gray-500">No certifications listed</li>}
            </ul>
          )}
        </div>

        {/* Education */}
        <div className="card p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Education</h3>
            <button onClick={() => setIsEditingEdu(!isEditingEdu)} className="text-sm text-blue-600 hover:underline">
              {isEditingEdu ? "Cancel" : "Edit"}
            </button>
          </div>
          {isEditingEdu ? (
            <>
              <input
                className="w-full border px-2 py-1 mb-2"
                value={education.degree}
                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
              />
              <input
                className="w-full border px-2 py-1"
                value={education.college}
                onChange={(e) => setEducation({ ...education, college: e.target.value })}
              />
            </>
          ) : (
            <>
              {education.degree ? (
                <>
                  <p className="font-semibold">{education.degree}</p>
                  <p className="text-gray-600">{education.college}</p>
                </>
              ) : (
                <p className="text-gray-500">Add your education details</p>
              )}
            </>
          )}
        </div>

        {/* Testimonials */}
        <div className="card p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Testimonials</h3>
            <button onClick={() => setIsEditingTestimonial(!isEditingTestimonial)} className="text-sm text-blue-600 hover:underline">
              {isEditingTestimonial ? "Cancel" : "Edit"}
            </button>
          </div>
          {isEditingTestimonial ? (
            <textarea
              className="w-full border px-2 py-1"
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
            />
          ) : (
            <blockquote className="text-gray-700 italic border-l-4 border-gray-400 pl-4">
              “{testimonial}”
            </blockquote>
          )}
        </div>

        {/* Availability */}
        <div className="card p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Availability</h3>
            <button onClick={() => setIsEditingAvailability(!isEditingAvailability)} className="text-sm text-blue-600 hover:underline">
              {isEditingAvailability ? "Cancel" : "Edit"}
            </button>
          </div>
          {isEditingAvailability ? (
            <textarea
              className="w-full border px-2 py-1"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          ) : (
            <p className="text-gray-700">{availability || 'Set your availability in edit mode'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;