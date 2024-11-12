import React from 'react';
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

const AssessmentRow = ({ title, department, date, score, icon: Icon = Clock }) => (
  <div className="flex items-center py-4 hover:bg-gray-50 px-4 -mx-4">
    <div className="p-2 bg-gray-100 rounded-lg mr-4">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
      <div className="font-medium text-gray-900 truncate">{title}</div>
      <div className="text-sm text-gray-500 truncate">
        {department} • {date}
      </div>
    </div>
    <div className="text-base font-medium text-gray-900 ml-4">{score}</div>
  </div>
);

const Dashboard = () => {
  const recentAssessments = [
    { 
      id: 1, 
      title: 'Software Development Maturity', 
      score: '78%', 
      date: 'Mar 1, 2024', 
      department: 'Engineering' 
    },
    { 
      id: 2, 
      title: 'DevOps Practices Assessment', 
      score: '65%', 
      date: 'Feb 28, 2024', 
      department: 'Operations' 
    },
    { 
      id: 3, 
      title: 'Security Controls Evaluation', 
      score: '82%', 
      date: 'Feb 25, 2024', 
      department: 'Security' 
    },
    { 
      id: 4, 
      title: 'Product Management Process', 
      score: '75%', 
      date: 'Feb 24, 2024', 
      department: 'Product' 
    }
  ];

  const popularAssessments = [
    { 
      id: 1, 
      title: 'Agile Team Maturity', 
      score: '72% avg', 
      date: '145 completions', 
      department: 'Most Popular',
      icon: Star
    },
    { 
      id: 2, 
      title: 'Cloud Infrastructure Review', 
      score: '68% avg', 
      date: '98 completions', 
      department: 'Trending',
      icon: Star
    },
    { 
      id: 3, 
      title: 'Code Quality Assessment', 
      score: '75% avg', 
      date: '76 completions', 
      department: 'New',
      icon: Star
    }
  ];
  const navigate = useNavigate();
  const handleStartAssessment = () => {
    navigate('/assessment'); // Navigate to the assessment page
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="lg:flex-1">
            <DashboardStats 
              icon={ClipboardCheck}
              label="Total Assessments"
              value="1,248"
              trend="+12.5%"
            />
          </div>
          <div className="lg:flex-1">
            <DashboardStats 
              icon={BarChart3}
              label="Assessments This Month"
              value="86"
              trend="+8.2%"
            />
          </div>
          <div className="lg:flex-1">
            <DashboardStats 
              icon={TrendingUp}
              label="Average Maturity Score"
              value="72.5%"
              trend="+4.3%"
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
                {recentAssessments.map(assessment => (
                  <AssessmentRow 
                    key={assessment.id}
                    {...assessment}
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
                {popularAssessments.map(assessment => (
                  <AssessmentRow 
                    key={assessment.id}
                    {...assessment}
                    icon={Star}
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
            <div className="bg-white rounded-lg p-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;