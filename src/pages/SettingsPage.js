import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Clock, 
  User,
  Receipt,
  ChevronRight,
  Plus,
  Building2,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

import EditProfileModal from '../components/EditProfileModal'; // Import your modal component
import useUserProfile from '../hooks/useUserProfile'; // Import the custom hook

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch the user data using the custom hook
  const { userData, loading, error } = useUserProfile();
console.log(userData);

  // If user data is available, use it; otherwise, fall back to location state or defaults
  const { firstName, email, credits, profileImage } = userData || location.state || {};

  // Default transactions for display (if needed)
  const [transactions] = useState([
    { id: 1, type: 'Credit Purchase', amount: 100, credits: 200, date: '2024-02-01' },
    { id: 2, type: 'Credit Purchase', amount: 45, credits: 100, date: '2024-01-15' },
    { id: 3, type: 'Credit Purchase', amount: 25, credits: 50, date: '2024-01-01' }
  ]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const handleClick = () => {
    // Navigate to the /invoices page
    navigate('/invoices');
  };
  // Handle loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 pt-6 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button 
            onClick={() => navigate(-1)} // Navigate back when clicked
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {/* Profile Section */}
          <div className="p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Profile</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {profileImage ? <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full" /> : <User className="w-5 h-5 text-gray-500" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{firstName || 'Guest User'}</div>
                  <div className="text-sm text-gray-500">{email || 'guest@example.com'}</div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)} // Open the modal on click
                className="text-sm text-gray-600 hover:text-red-500"
              >
                Edit Profile
              </button>
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Company Details</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Payment Methods</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">•••• 4242</div>
                    <div className="text-xs text-gray-500">Expires 12/24</div>
                  </div>
                </div>
                <span className="text-xs py-1 px-2 bg-green-100 text-green-700 rounded">Default</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 border border-dashed rounded-lg p-3 hover:text-red-500 hover:border-red-500">
                <Plus className="w-4 h-4" />
                Add Payment Method
              </button>
            </div>
          </div>

          {/* Billing Overview */}
          <div className="p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Billing</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Available Credits</div>
                <div className="text-xl font-bold text-gray-900">{credits || 0}</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Monthly Spending</div>
                <div className="text-xl font-bold text-gray-900">$145.00</div>
              </div>
            </div>
            <button
      onClick={handleClick}
      className="w-full flex items-center justify-between text-sm text-gray-600 border rounded-lg p-3 hover:border-red-200"
    >
      <div className="flex items-center gap-2">
        <Receipt className="w-4 h-4" />
        View Invoices
      </div>
      <ChevronRight className="w-4 h-4" />
    </button>
          </div>

          {/* Recent Transactions */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Recent Transactions</h2>
              <button className="text-sm text-gray-600 hover:text-red-500">View All</button>
            </div>
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.credits} Credits
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 sm:p-6">
            <button className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData} // Pass the user data to the modal
      />
    </div>
  );
};

export default SettingsPage;
