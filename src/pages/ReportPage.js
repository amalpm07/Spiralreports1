import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ToolsPage from './ToolsPage';
import { useLocation } from 'react-router-dom';
import  { useState } from 'react';
import logo from '../assets/SpiralReports Logo White.jpg'
// Data structures
const assessmentData = {
  categories: {
    
  },  radarData: [
    { category: 'Formal Guidance', currentScore: 2, targetScore: 12 },
    { category: 'Tracking and KPIs', currentScore: 2, targetScore: 12 },
    { category: 'Crisis Management', currentScore: 2, targetScore: 12 },
    { category: 'Staff Experience', currentScore: 2, targetScore: 12 }
  ]
};






const SOC1Assessment = () => {
  const location = useLocation();
  const reportData = location.state?.reportData || {};  // Default to empty object if not available
  const findings = reportData?.generation?.summary_of_findings || [];
  const Header = () => (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 flex justify-between h-16">
        <div className="flex items-center gap-4">
        <img
          src={ logo}
          alt="Logo"
          style={{
            height: '30px',  // Adjust height for scrolled and not scrolled states
            width:  'auto',  // Maintain auto width, but you can also adjust width here if needed
            transition: 'height 0.3s ease',  // Smooth transition for the height change
          }}
          // Add onClick event handler for logo
        />
          
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2">
            <span className="text-2xl">∞</span>Begin New Assessment
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-full px-4 py-2">95 Credits</div>
            <button className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center text-xl">+</button>
            <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">TE</button>
          </div>
        </div>
      </div>
    </nav>
  );

  const RenderPieChart = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);  // Track hovered slice
  
    // Handle mouse enter and leave
    const handleMouseEnter = (index) => {
      setHoveredIndex(index);  // Set the hovered slice index
    };
  
    const handleMouseLeave = () => {
      setHoveredIndex(null);  // Reset when mouse leaves
    };
  
    return (
      <div className="w-80">
        <div className="sticky top-8">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                startAngle={-70}
                endAngle={290}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}  // Keep the original color
                    onMouseEnter={() => handleMouseEnter(index)}  // Set the hovered slice
                    onMouseLeave={handleMouseLeave}  // Reset on mouse leave
                    style={{
                      // Smooth transition for transform and shadow
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',  
                      transform: hoveredIndex === index ? 'translateY(-12px)' : 'translateY(0)',  // Lift the hovered slice
                      zIndex: hoveredIndex === index ? 10 : 1,  // Make the hovered slice come forward
                      boxShadow: hoveredIndex === index 
                        ? '0 10px 30px rgba(0, 0, 0, 0.2)'   // Smooth and subtle shadow on hover
                        : '0 0 0 rgba(0, 0, 0, 0)',  // No shadow when not hovered
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  const SnapshotSection = () => {
    const location = useLocation();
    const reportData = location.state?.reportData || {};  // Default to empty object if not available
    const findings = reportData?.generation?.summary_of_findings || [];
  
    return (
      <div className="max-w-7xl mx-auto px-8 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <span className="text-2xl">∞</span>
          <h2 className="text-3xl font-bold mt-4">Here's the latest SOC 1 snapshot,<br />tailored from your inputs!</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {findings.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-red-500 font-medium mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.current_state}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const RecommendationSection = ({  title, findings }) => {
    const [hoveredRecommendation, setHoveredRecommendation] = useState(null);
  
    // Generate the pie data from the findings
    const numberOfRecommendations = findings.length; // Number of recommendations
    const sliceValue = 100 / numberOfRecommendations; // Equal distribution of the pie
  
    // Create the pie chart data
    const pieData = findings.map((finding, index) => ({
      name: finding.recommendation_title,
      value: sliceValue,
      color: index % 2 === 0 ? '#f87171' : '#fcd34d' // Alternate colors for each slice (if needed)
    }));
  
    const handleRecommendationMouseEnter = (index) => {
      setHoveredRecommendation(index);  // Set hovered item
    };
  
    const handleRecommendationMouseLeave = () => {
      setHoveredRecommendation(null);  // Reset when mouse leaves
    };
  
    return (
      <>
        <div className="bg-red-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <span className="text-2xl">∞</span>
            <h2 className="text-2xl font-bold mt-4">RECOMMENDATION</h2>
            <h3 className="text-4xl font-bold mt-4">{title}</h3>
          </div>
        </div>
  
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex gap-16">
            <RenderPieChart data={pieData} /> {/* Now pieData is defined */}
            <div className="flex-1">
              {findings.map((finding, index) => (
                <div
                  key={index}
                  className={`mb-8 p-4 transition-all duration-300 ${
                    hoveredRecommendation === index ? 'bg-gray-200 border-l-4 border-red-500' : 'bg-white'
                  }`}  // Apply highlight on hover
                  onMouseEnter={() => handleRecommendationMouseEnter(index)}  // Set hovered item
                  onMouseLeave={handleRecommendationMouseLeave}  // Reset on mouse leave
                >
                  <div className="flex">
                    <span className="text-red-400 font-bold mr-4">{index + 1}</span>
                    <div>
                      <h4 className="text-red-400 font-semibold">{finding.recommendation_title}</h4>
                      <p className="text-gray-600 mt-1">{finding.recommendation_description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };
  

  

  const Dashboard = () => (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Your total readiness for <span className="text-red-500">SOC 1</span> stands at <span className="text-red-500">0%</span>
            </h1>
            <p className="text-gray-600 max-w-4xl">
              This report presents the findings from the SOC 1 assessment conducted on the Business Continuity Plan,
              specifically focusing on governance and organization. The assessment revealed significant gaps and
              opportunities for improvement in the organization's Business Continuity Management (BCM) practices.
            </p>
          </div>
          <div className="mb-16">
            <div className="text-center mb-8">
              <span className="text-2xl">∞</span>
              <h2 className="text-2xl font-bold mt-4">Results derived from your responses to questions for each track</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={assessmentData.radarData}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#4A5568', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 12]} />
                <Radar name="Current Score" dataKey="currentScore" stroke="#63B3ED" fill="#63B3ED" fillOpacity={0.6} />
                <Radar name="Target Score" dataKey="targetScore" stroke="#48BB78" fill="#48BB78" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <aside className="w-80 shrink-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Readiness Score</h3>
            <div className="flex justify-center items-center mb-8">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">0</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm text-gray-600 mb-1">Readiness by category</h4>
              <p className="text-xs text-gray-500 mb-4">Your readiness from your responses</p>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-red-500 text-xl font-medium">0.00</span>
                <span className="text-gray-700">Governance and organization</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

 
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Dashboard />
        <SnapshotSection />
         {/* Recommendation Section based on dynamic data */}
         {findings.map((finding, index) => (
          <RecommendationSection
            key={index}
            title={finding.title}
            findings={finding.recommendations_for_improvement}
          />
        ))}
     <ToolsPage reportData={reportData} />
      </main>
    </div>
  );
};

export default SOC1Assessment;