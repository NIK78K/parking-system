import { useState, useEffect } from 'react';
import { parkingAPI } from '../../services/api';
import Layout from '../../components/Layout';

export default function ActiveVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Active Vehicles</h1>
          <button
            onClick={fetchActiveVehicles}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">No vehicles currently parked</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    License Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entry Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Operator
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {vehicle.ticket_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold">
                      {vehicle.license_plate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize">
                        {vehicle.vehicle_type === 'car' ? '🚗 Car' : '🏍️ Motorcycle'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(vehicle.entry_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {Math.floor(vehicle.duration_minutes / 60)}h {vehicle.duration_minutes % 60}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {vehicle.operator_in}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>{vehicles.length}</strong> vehicle(s) currently parked • Auto-refresh every 30 seconds
          </p>
        </div>
      </div>
    </Layout>
  );
}
