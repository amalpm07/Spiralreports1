import React, { useEffect, useState } from 'react';
import { 
  BarChart3,
  ClipboardCheck,
  Clock,
  PlayCircle,
  TrendingUp,
  ChevronRight,
  Plus,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../hooks/AuthContext';

const DashboardStats = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white rounded-lg p-6">
    <div className="flex flex-col gap-4">
      <div className="p-2.5 bg-red-50 rounded-lg w-fit">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
        <ArrowUpRight className="w-4 h-4" />
        {trend}
      </div>
    )}
  </div>
);

const AssessmentRow = ({ title, department, date, score, icon: Icon = Clock }) => {
  // Format the date using toLocaleDateString
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',  // Optional: To include day of the week
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : null; // Only format if date exists

  return (
    <div className="flex items-center py-4 hover:bg-gray-50 px-4 -mx-4">
      <div className="p-2 bg-gray-100 rounded-lg mr-4">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
        <div className="font-medium text-gray-900 truncate">{title}</div>
        <div className="text-sm text-gray-500 truncate">
          {department} {formattedDate && `• ${formattedDate}`}
        </div>
      </div>
      <div className="text-base font-medium text-gray-900 ml-4">{score}</div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  
  const access_token = authData?.access_token || authData?.accessToken;
  const navigate = useNavigate();
  
  const handleStartAssessment = () => {
    navigate('/assessment'); // Navigate to the assessment page
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://app.spiralreports.com/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,  // Pass token in the header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setDashboardData(data);
        setLoading(false);  // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message);  // Set error if the request fails
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // Empty dependency array to run only once when the component mounts

  // Render loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { recent_assessments, popular_assessments, total_assessments, assessments_this_month, average_maturity_score } = dashboardData?.data || {};

  return (
    <div>
      <Header />
      <div className="min-h-screen pt-20 bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="lg:flex-1">
              <DashboardStats
                icon={ClipboardCheck}
                label="Total Assessments"
                value={total_assessments || '0'}
              />
            </div>
            <div className="lg:flex-1">
              <DashboardStats
                icon={BarChart3}
                label="Assessments This Month"
                value={assessments_this_month || '0'}
              />
            </div>
            <div className="lg:flex-1">
              <DashboardStats
                icon={TrendingUp}
                label="Average Maturity Score"
                value={average_maturity_score || '0%'}
              />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Assessments */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Assessments</h2>
                  <button className="text-sm text-gray-600 hover:text-red-500">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {recent_assessments?.map((assessment) => (
                    <AssessmentRow
                      key={assessment.id}
                      title={assessment.title}
                      department={assessment.department}
                      date={assessment.updatedAt}
                      score={assessment.maturity}
                    />
                  ))}
                </div>
              </div>

              {/* Popular Assessments */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Popular Assessments</h2>
                  <button className="text-sm text-gray-600 hover:text-red-500">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {popular_assessments?.map((assessment) => (
                    <AssessmentRow
                      key={assessment.id}
                      title={assessment.title}
                      department={assessment.department}
                      score={assessment.avgMaturity} // No date for popular assessments
                      icon={assessment.icon || Star} // Default to Star icon if not provided
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Start Assessment Card */}
              <div className="bg-white rounded-lg p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlayCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start New Assessment
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Begin a new assessment to evaluate your team's maturity.
                  </p>
                  <button
                    onClick={handleStartAssessment} // Add the click handler
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-500 rounded-lg py-2.5 px-4 hover:bg-red-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Start Assessment
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              {/* <div className="bg-white rounded-lg p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between text-sm text-gray-600 border rounded-lg p-3 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      Templates
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between text-sm text-gray-600 border rounded-lg p-3 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
