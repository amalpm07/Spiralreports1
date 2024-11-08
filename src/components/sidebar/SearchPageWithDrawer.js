import React, { useState } from 'react';
import { 
  Search, 
  List, 
  PlusCircle, 
  ChevronRight, 
  LogOut, 
  X, 
  Menu, 
  Settings, 
  CreditCard,
  FileText,
  User,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/AuthContext'; // Import useAuth

function SearchPageWithDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate(); 
  const { authData, logout } = useAuth(); // Get auth data and logout function from context
// console.log(authData);

  // Default user profile if authData is not available
  const userProfile = authData ? {
    name: authData.firstName,
    email: authData.email,
    credits: authData.credits,
    image: authData.profileImage // Assuming image URL is stored in authData
  } : {
    name: "Guest User",
    email: "guest@example.com",
    credits: 0,
    image: "/api/placeholder/80/80"
  };

  const navItems = [
    {icon:Home,label:"Dashboard",badge:null,path:'/dashboard'},
    { icon: Search, label: "Search Assessments", badge: null, path: '/search' },
    { icon: List, label: "All Assessments", badge: null, path: '/assessmentsPage' },
    { icon: FileText, label: "Draft Assessments", badge: "3", path: '/drafts' },
    { icon: CreditCard, label: "Credit History", badge: null, path: '/credits' },
    { icon: User, label: "Settings", badge: null, path: '/settings' }, // Added path for Settings
  ];

  const handleNavItemClick = (path, state = {}) => {
    setIsDrawerOpen(false);
    navigate(path, { state }); // Pass state when navigating
  };

  const handleAddCredits = () => {
    setIsDrawerOpen(false);
    navigate('/add-credits'); 
  };

  const handleLogout = () => {
    logout(); // Call the logout function from useAuth
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="bg-gray-50 relative">
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Account</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative px-6 py-8 bg-gradient-to-r from-red-500 to-red-600">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img src={userProfile.image} alt="Profile" className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30" />
              <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-lg">
                <Settings size={14} className="text-red-500" />
              </button>
            </div>
            <div className="flex-1">
            <h3 className="font-semibold text-white text-lg uppercase">{userProfile.name}</h3>
            <p className="text-red-100 text-sm">{userProfile.email}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 border-b border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Credits</p>
                <p className="text-3xl font-bold text-gray-800">{userProfile.credits}</p>
              </div>
              <button 
                onClick={handleAddCredits} 
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
              >
                <PlusCircle size={18} />
                Add Credits
              </button>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
            </div>
          </div>
        </div>
         
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <button 
                key={index} 
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
                onClick={() => handleNavItemClick(item.path, item.path === '/settings' ? userProfile : {})} // Pass userProfile for settings
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout} // Call the logout function
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="bg-red-500 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white"> Begin Assessments</h1>
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 rounded-full bg-white hover:bg-gray-100 transition-all">
            <Menu size={24} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchPageWithDrawer;
