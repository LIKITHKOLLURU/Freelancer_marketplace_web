import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiService from '../services/apiService';

function Settings() {
  const { user: authUser } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    notifications: true,
    language: 'English',
    timezone: 'GMT',
    darkMode: false,
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', formData);
    // Send updated data to backend here
  };

  // Prefill from logged-in user and optionally refresh from backend
  useEffect(() => {
    const load = async () => {
      try {
        if (!authUser) return;
        let latest = authUser;
        if (authUser?._id) {
          try {
            const fresh = await apiService.getUserById(authUser._id);
            if (fresh) latest = fresh;
          } catch (_) {}
        }
        setFormData((prev) => ({
          ...prev,
          username: latest?.name || latest?.username || '',
          email: latest?.email || '',
        }));
      } catch (_) {}
    };
    load();
  }, [authUser]);

  const handlePasswordUpdate = () => {
    setSuccessMessage('Password updated');
    setTimeout(() => {
      setSuccessMessage(''); // Clear the message after 3 seconds
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Account Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Username"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Email"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            className="w-full p-2 border rounded"
            placeholder="New Password"
          />
        </div>

        {/* Password Update Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handlePasswordUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update Password
          </button>
          {successMessage && (
            <p className="mt-2 text-green-600">{successMessage}</p>
          )}
        </div>

        {/* Notification Preferences */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Notification Preferences</h2>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="mr-2"
            />
            Receive Email Notifications
          </label>
        </div>

        {/* Regional Preferences */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Regional Preferences</h2>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="GMT">GMT</option>
            <option value="IST">IST</option>
            <option value="EST">EST</option>
          </select>
        </div>

        {/* Display Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Display Settings</h2>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="darkMode"
              checked={formData.darkMode}
              onChange={handleChange}
              className="mr-2"
            />
            Enable Dark Mode
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Settings;
