// src/pages/UserProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';

function UserProfile() {
  const { id } = useParams(); // user ID from the URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await apiService.getUserById(id);
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <p className="text-gray-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
      <p className="text-gray-700">{userData.role}</p>
      <p className="mt-2">{userData.bio}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Skills:</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {userData.skills?.map((skill, idx) => (
            <span key={idx} className="bg-gray-200 px-2 py-1 rounded">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
