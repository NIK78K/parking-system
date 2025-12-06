import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { parkingAPI } from '../../services/api';
import Layout from '../../components/Layout';

export default function CheckIn() {
  const [formData, setFormData] = useState({
    license_plate: '',
    vehicle_type: 'car',
  });
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setError(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await parkingAPI.checkIn(formData);
      setTransaction(response.data.transaction);
      setFormData({ license_plate: '', vehicle_type: 'car' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check-in');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewCheckIn = () => {
    setTransaction(null);
  };

  if (transaction) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-600 mb-4">
                ✓ Check-In Successful!
              </h1>
              
              {/* QR Code */}
              <div className="flex justify-center my-8">
                <div className="p-4 bg-white border-4 border-gray-300 rounded-lg">
                  <QRCodeSVG
                    value={transaction.qr_code}
                    size={256}
                    level="H"
                  />
                </div>
              </div>

              {/* Transaction Details */}
              <div className="text-left space-y-3 mb-8">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Ticket Number:</span>
                  <span className="font-mono">{transaction.ticket_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">License Plate:</span>
                  <span className="font-mono">{transaction.license_plate}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Vehicle Type:</span>
                  <span className="capitalize">{transaction.vehicle_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Entry Time:</span>
                  <span>{new Date(transaction.entry_time).toLocaleString()}</span>
                </div>
                <div className="py-3 border-t-2 border-gray-300 mt-4">
                  <span className="font-medium block mb-2">QR Code (for manual input):</span>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <code className="text-xs break-all">{transaction.qr_code}</code>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.qr_code);
                      alert('QR code copied to clipboard!');
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    📋 Copy QR Code
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Print Ticket
                </button>
                <button
                  onClick={handleNewCheckIn}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-medium"
                >
                  New Check-In
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Vehicle Check-In</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-2">
                License Plate Number *
              </label>
              <input
                id="license_plate"
                name="license_plate"
                type="text"
                required
                value={formData.license_plate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono uppercase"
                placeholder="B1234XYZ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.vehicle_type === 'car'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="vehicle_type"
                    value="car"
                    checked={formData.vehicle_type === 'car'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-2">🚗</div>
                    <div className="font-medium">Car</div>
                  </div>
                </label>

                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.vehicle_type === 'motorcycle'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="vehicle_type"
                    value="motorcycle"
                    checked={formData.vehicle_type === 'motorcycle'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏍️</div>
                    <div className="font-medium">Motorcycle</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {loading ? 'Processing...' : 'Check-In Vehicle'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
