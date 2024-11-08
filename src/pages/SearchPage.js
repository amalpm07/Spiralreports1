import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Bookmark, BookmarkCheck, Book, Users, Clock, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import AssessmentCard from '../components/cards/AssessmentCard';
import SearchBar from '../components/cards/SearchBar';
import SearchPageWithDrawer from '../components/sidebar/SearchPageWithDrawer';
import { useAuth } from '../hooks/AuthContext';
import { useLocation } from 'react-router-dom';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedAssessments, setSavedAssessments] = useState([]);
  const [assessments, setAssessments] = useState([]); // Initialize as an empty array
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { authData } = useAuth();
  const location = useLocation(); // To access location.state for access token passed from signup
  const access_token = location.state?.access_token || authData?.accessToken;  // Priority to location.state

  // Log access_token to see which one is being used
  console.log("Access Token:", access_token);

  // Organize assessments into a 3x2 grid structure
  const toggleSave = (assessmentId) => {
    setSavedAssessments((prev) =>
      prev.includes(assessmentId) ? prev.filter((id) => id !== assessmentId) : [...prev, assessmentId]
    );
  };

  useEffect(() => {
    if (access_token) {
      const fetchAssessments = async () => {
        try {
          const response = await fetch('https://app.spiralreports.com/api/assessments/all?page=1&limit=10&orderBy=desc', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch assessments');
          }

          const data = await response.json();
          const formattedAssessments = data.data.results.map((assessment) => ({
            id: assessment.id,
            name: assessment.title,
            tags: assessment.tags,
            questionCount: assessment.questionCount,
            completionCount: assessment.evaluationCount || 0,
            duration: 'N/A',
            credits: assessment.credReq || 0,
          })).sort((a, b) => b.completionCount - a.completionCount);
          
          setAssessments(formattedAssessments);
        } catch (error) {
          console.error('Error fetching assessments:', error);
        }
      };

      fetchAssessments();
    }
  }, [access_token]); // Effect will re-run if access_token changes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-red-500 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-white hover:text-gray-200"
          >
            {/* Sidebar Icon */}
          </button>
        </div>
      </div>
      <SearchPageWithDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <div className="bg-red-500 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          {/* Add additional UI elements if needed */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 -mt-8">
        {/* Search Bar */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 rounded-xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <Search className="absolute left-5 top-5 text-gray-400" size={20} />
        </div>

        {/* Popular Assessments Section */}
        <div className="max-w-7xl mx-auto px-8 mt-6">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Popular Assessments</h2>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
                View Most Popular
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.length > 0 ? (
                  assessments.map((assessment) => (
                    <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    isSaved={savedAssessments.includes(assessment.id)}
                    onToggleSave={toggleSave}
                    access_token={access_token}  
                  />
                  ))
                ) : (
                  <p>No assessments found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
