import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isAdmin ? '4' : '3'} gap-6`}>
          {/* Active Vehicles */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Vehicles</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.active_vehicles?.total || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span>Cars: {stats?.active_vehicles?.car || 0}</span>
              <span className="mx-2">|</span>
              <span>Motorcycles: {stats?.active_vehicles?.motorcycle || 0}</span>
            </div>
          </div>

          {/* Today Vehicles */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today Vehicles</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats?.today?.vehicles || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>

          {/* Today Revenue - Admin Only */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today Revenue</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    Rp {(stats?.today?.revenue || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-3xl">💰</span>
                </div>
              </div>
            </div>
          )}

          {/* Available Slots */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Slots</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats?.available_slots || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-3xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          {stats?.recent_activity?.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_activity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {activity.vehicle_type === 'car' ? '🚗' : '🏍️'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{activity.license_plate}</p>
                      <p className="text-sm text-gray-500">Entry: {activity.entry_time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-semibold">{formatDuration(activity.duration_minutes)}</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
