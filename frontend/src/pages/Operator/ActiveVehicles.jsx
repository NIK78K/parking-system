import { useState, useEffect } from 'react';
import { parkingAPI } from '../../services/api';
import Layout from '../../components/Layout';
import { QRCodeSVG } from 'qrcode.react';

export default function ActiveVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, car, motorcycle
  const [showQR, setShowQR] = useState(null);

  useEffect(() => {
    fetchActiveVehicles();
    const interval = setInterval(fetchActiveVehicles, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchActiveVehicles = async () => {
    try {
      const response = await parkingAPI.getActive();
      setVehicles(response.data.transactions);
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    if (filter === 'all') return true;
    return v.vehicle_type === filter;
  });

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Active Vehicles</h1>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('car')}
            className={`px-6 py-2 rounded-lg font-medium ${
              filter === 'car' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cars
          </button>
          <button
            onClick={() => setFilter('motorcycle')}
            className={`px-6 py-2 rounded-lg font-medium ${
              filter === 'motorcycle' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Motorcycles
          </button>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">No vehicles currently parked</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    License Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entry Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Current Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl">
                        {vehicle.vehicle_type === 'car' ? '🚗' : '🏍️'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{vehicle.license_plate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatTime(vehicle.entry_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-blue-600 font-medium">
                        {formatDuration(vehicle.duration_minutes)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      Rp {vehicle.estimated_fee?.toLocaleString('id-ID') || '5.000'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setShowQR(vehicle)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">QR Code</h3>
              <button
                onClick={() => setShowQR(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <QRCodeSVG value={showQR.qr_code} size={200} />
              <div className="text-center">
                <p className="font-bold text-lg">{showQR.license_plate}</p>
                <p className="text-sm text-gray-600">{showQR.ticket_number}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
