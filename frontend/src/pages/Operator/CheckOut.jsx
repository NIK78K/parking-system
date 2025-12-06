import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { parkingAPI } from '../../services/api';
import Layout from '../../components/Layout';

export default function CheckOut() {
  const [scanner, setScanner] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualQR, setManualQR] = useState('');
  const [paymentData, setPaymentData] = useState({
    payment_method: 'cash',
    notes: '',
  });

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  const startScanner = () => {
    setScanning(true);
    setError(null);

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
  };

  const onScanSuccess = async (decodedText) => {
    if (scanner) {
      scanner.clear();
      setScanning(false);
    }
    await fetchTransaction(decodedText);
  };

  const onScanError = (error) => {
    // Ignore scan errors
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanning(false);
    }
  };

  const fetchTransaction = async (qrCode) => {
    setLoading(true);
    setError(null);

    try {
      const response = await parkingAPI.scanQR(qrCode);
      setTransaction(response.data.transaction);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction not found');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    fetchTransaction(manualQR);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await parkingAPI.checkOut(transaction.id, paymentData);
      alert(`Check-out successful!\nTotal Fee: Rp ${response.data.transaction.total_fee.toLocaleString()}`);
      setTransaction(null);
      setPaymentData({ payment_method: 'cash', notes: '' });
      setManualQR('');
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Vehicle Check-Out</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!transaction ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Scanner */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
              
              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Start Camera Scanner
                </button>
              ) : (
                <>
                  <div id="qr-reader" className="mb-4"></div>
                  <button
                    onClick={stopScanner}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Stop Scanner
                  </button>
                </>
              )}
            </div>

            {/* Manual Input */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Manual Input</h2>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter QR Code
                  </label>
                  <input
                    type="text"
                    value={manualQR}
                    onChange={(e) => setManualQR(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste QR code here"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !manualQR}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Fetch Transaction'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Transaction Info */}
              <div className="space-y-3">
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
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Duration:</span>
                  <span>{Math.floor(transaction.duration_minutes / 60)}h {transaction.duration_minutes % 60}m</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300">
                  <span className="font-bold text-lg">Total Fee:</span>
                  <span className="font-bold text-xl text-green-600">
                    Rp {transaction.estimated_fee.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentData.payment_method}
                    onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="qris">QRIS</option>
                    <option value="e-wallet">E-Wallet</option>
                    <option value="debit">Debit Card</option>
                    <option value="credit">Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any notes..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => setTransaction(null)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Check-Out'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
