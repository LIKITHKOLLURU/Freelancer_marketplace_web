import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiService from '../services/apiService';

function Notifications() {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const notificationsData = await apiService.getNotificationsByUserId(user._id);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'bid_received': return '💰';
      case 'competing_bid': return '⚡';
      case 'new_application': return '📝';
      case 'job_match': return '🎯';
      case 'project_completed': return '✅';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'bid_received': return 'border-l-green-500 bg-green-50';
      case 'competing_bid': return 'border-l-yellow-500 bg-yellow-50';
      case 'new_application': return 'border-l-blue-500 bg-blue-50';
      case 'job_match': return 'border-l-purple-500 bg-purple-50';
      case 'project_completed': return 'border-l-emerald-500 bg-emerald-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your latest activities</p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications</h3>
          <p className="text-gray-500">You're all caught up! No new notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border-l-4 p-4 rounded-lg shadow-sm ${getNotificationColor(notification.type)} ${
                !notification.read ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                    {!notification.read && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
}

export default Notifications;
