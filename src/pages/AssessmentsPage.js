import React, { useState } from 'react';
import { 
  Search,
  Filter,
  ArrowLeft,
  MoreVertical,
  Share2,
  FileText,
  RefreshCw,
  Tag,
  ChevronDown,
  Shield,
  Coins,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../hooks/AuthContext'; // Import useAuth
import useAssessments from '../hooks/useAssessments'; // Import your custom hook

const AssessmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("all");
  const [selectedMaturity, setSelectedMaturity] = useState("all");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState({});
  
  const { assessments, loading, error } = useAssessments(); // Using the custom hook to get the assessments
  const navigate = useNavigate(); // Initialize useNavigate hook

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  const getRelativeTime = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > -7) return rtf.format(diffDays, "day");
    if (diffDays > -30) return rtf.format(Math.round(diffDays / 7), "week");
    if (diffDays > -365) return rtf.format(Math.round(diffDays / 30), "month");
    return rtf.format(Math.round(diffDays / 365), "year");
  };

  const getMaturityColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getMaturityLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const toggleMoreMenu = (id) => {
    setIsMoreMenuOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter the assessments based on the selected filters
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework = selectedFramework === "all" || assessment.framework === selectedFramework;
    const matchesMaturity = selectedMaturity === "all" ||
      (selectedMaturity === "high" && assessment.maturity >= 80) ||
      (selectedMaturity === "medium" && assessment.maturity >= 60 && assessment.maturity < 80) ||
      (selectedMaturity === "low" && assessment.maturity < 60);
    
    return matchesSearch && matchesFramework && matchesMaturity;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button 
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
            aria-label="Go back"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">My Assessments</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search assessments..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select
                  className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                >
                  <option value="all">All Frameworks</option>
                  <option value="ISO 27001">ISO 27001</option>
                  <option value="GDPR">GDPR</option>
                  <option value="NIST CSF">NIST CSF</option>
                </select>
              </div>
              <select
                className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                value={selectedMaturity}
                onChange={(e) => setSelectedMaturity(e.target.value)}
              >
                <option value="all">All Scores</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (60-79%)</option>
                <option value="low">Low (&lt;60%)</option>
              </select>
            </div>
          </div>

          {/* Loading / Error State */}
          {loading && <div className="p-4 text-center">Loading...</div>}
          {error && <div className="p-4 text-center text-red-600">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Framework & Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maturity Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{assessment.name}</div>
                    
                      <div className="text-sm text-gray-500">{assessment.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-900 uppercase">{assessment.compliance}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {assessment.subdomainScore.map((score, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                           
                            {score.subdomain}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(assessment.createdAt)}</div>
                      <div className="text-sm text-gray-500">{getRelativeTime(assessment.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-900">
                        <Coins className="w-4 h-4 text-gray-400" />
                        {assessment.creditsUsed}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        <span
                          className={`text-lg font-bold mb-1 ${
                            assessment.maturity >= 80
                              ? 'text-green-600'
                              : assessment.maturity >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {assessment.maturity}%
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMaturityColor(
                            assessment.maturity
                          )}`}
                        >
                          {getMaturityLabel(assessment.maturity)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">
                          View Report
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => toggleMoreMenu(assessment.id)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                            aria-label={`More actions for ${assessment.title}`}
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          {isMoreMenuOpen[assessment.id] && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share Report
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Download PDF
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Report
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
