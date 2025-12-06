import { useState, useEffect } from 'react';
import { ratesAPI } from '../../services/api';
import Layout from '../../components/Layout';

export default function Settings() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [carRates, setCarRates] = useState({
    first_hour: 3000,
    next_hour: 2000,
  });

  const [motorcycleRates, setMotorcycleRates] = useState({
    first_hour: 2000,
    next_hour: 1000,
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await ratesAPI.getAll();
      const ratesData = response.data.rates;
      
      const carRate = ratesData.find(r => r.vehicle_type === 'car');
      const motorcycleRate = ratesData.find(r => r.vehicle_type === 'motorcycle');

      if (carRate) {
        setCarRates({
          id: carRate.id,
          first_hour: carRate.first_hour_rate,
          next_hour: carRate.next_hour_rate,
        });
      }

      if (motorcycleRate) {
        setMotorcycleRates({
          id: motorcycleRate.id,
          first_hour: motorcycleRate.first_hour_rate,
          next_hour: motorcycleRate.next_hour_rate,
        });
      }

      setRates(ratesData);
    } catch (error) {
      console.error('Error fetching rates:', error);
      setMessage({ type: 'error', text: 'Failed to load rates' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Update car rates
      await ratesAPI.update(carRates.id, {
        first_hour_rate: parseInt(carRates.first_hour),
        next_hour_rate: parseInt(carRates.next_hour),
      });

      // Update motorcycle rates
      await ratesAPI.update(motorcycleRates.id, {
        first_hour_rate: parseInt(motorcycleRates.first_hour),
        next_hour_rate: parseInt(motorcycleRates.next_hour),
      });

      setMessage({ type: 'success', text: 'Rates updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating rates:', error);
      setMessage({ type: 'error', text: 'Failed to update rates' });
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Parking Rates</h2>

          {/* Car Rates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              🚗 Car Rates
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Hour
              </label>
              <input
                type="number"
                value={carRates.first_hour}
                onChange={(e) => setCarRates({ ...carRates, first_hour: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Hour Rate
              </label>
              <input
                type="number"
                value={carRates.next_hour}
                onChange={(e) => setCarRates({ ...carRates, next_hour: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2000"
              />
            </div>
          </div>

          {/* Motorcycle Rates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
              🏍️ Motorcycle Rates
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Hour
              </label>
              <input
                type="number"
                value={motorcycleRates.first_hour}
                onChange={(e) => setMotorcycleRates({ ...motorcycleRates, first_hour: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Hour Rate
              </label>
              <input
                type="number"
                value={motorcycleRates.next_hour}
                onChange={(e) => setMotorcycleRates({ ...motorcycleRates, next_hour: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
