import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useLocation } from 'react-router-dom';

const Header = () => (
  <div className="w-full bg-white border-b">
    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/api/placeholder/40/40" alt="Spiral Reports Logo" className="h-8" />
        <div className="flex items-center ml-4">
          <button className="text-gray-400">←</button>
          <button className="text-gray-400 ml-2">→</button>
          <span className="ml-4 text-gray-600">qwd</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-full flex items-center">
          <span className="mr-2">∞</span>
          Begin New Assessment
        </button>
        <div className="flex items-center">
          <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
            <span className="text-gray-600">95</span>
            <span className="ml-1 text-gray-500">Credits</span>
          </span>
          <span className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-full">TE</span>
        </div>
      </div>
    </div>
  </div>
);

const RadarChartSection = () => {
  const data = [
    { name: 'Formal Organization', current: 2, target: 10 },
    { name: 'Staff Experience', current: 2, target: 10 },
    { name: 'Crisis Management', current: 2, target: 10 },
    { name: 'KPI Tracking', current: 2, target: 10 }
  ];

  return (
    <div className="w-full h-96 flex justify-center items-center">
      <RadarChart width={500} height={400} data={data}>
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis angle={30} domain={[0, 10]} />
        <Radar name="Target" dataKey="target" stroke="#86efac" fill="#86efac" fillOpacity={0.2} />
        <Radar name="Current" dataKey="current" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.6} />
      </RadarChart>
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

const RecommendationSection = ({ title, findings }) => {
    // Sort recommendations by risk level
    const sortedFindings = [...findings].sort((a, b) => {
      const riskOrder = { High: 1, Medium: 2, Low: 3 };
      return riskOrder[a.risk] - riskOrder[b.risk];
    });
  console.log(findings);
  
    // Create a count for each risk level (High, Medium, Low)
    const riskCounts = {
      High: 0,
      Medium: 0,
      Low: 0,
    };
  
    sortedFindings.forEach(finding => {
      riskCounts[finding.risk]++;
    });
  
    // Prepare data for the radar chart based on risk level counts
    const radarData = [
      { name: 'High', value: riskCounts.High },
      { name: 'Medium', value: riskCounts.Medium },
      { name: 'Low', value: riskCounts.Low }
    ];
  
    return (
      <div className="bg-red-400 text-white mt-16">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex flex-col items-center mb-8">
            <span className="text-3xl mb-2">∞</span>
            <h2 className="text-xl uppercase">RECOMMENDATION</h2>
            <h3 className="text-3xl font-bold mt-4">{title}</h3>
          </div>
          <div className="bg-white rounded-lg p-8 text-gray-800">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                {sortedFindings.map((finding, index) => (
                  <div key={index} className="mb-8">
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
              <div className="relative">
                <div className="w-48 h-48 mx-auto">
                  {/* Radar Chart Showing Risk Levels */}
                  <RadarChart width={200} height={200} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, Math.max(...radarData.map(d => d.value))]} />
                    <Radar name="Risk Level" dataKey="value" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.6} />
                  </RadarChart>
                </div>
                <div className="absolute bottom-0 right-0 flex items-center">
                  <span className="h-3 w-3 rounded-full bg-red-400 mr-2"></span>
                  <span className="text-sm">High</span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400 mx-2"></span>
                  <span className="text-sm">Medium</span>
                  <span className="h-3 w-3 rounded-full bg-green-400 ml-2"></span>
                  <span className="text-sm">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

const SOC1Report = () => {
  const location = useLocation();
  const reportData = location.state?.reportData || {};  // Default to empty object if not available
  const findings = reportData?.generation?.summary_of_findings || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Your total readiness for <span className="text-red-400">SOC 1</span> stands at <span className="text-red-400">{reportData?.generation?.maturity_level || '0%'}</span>
          </h1>
          <p className="text-gray-600">
            {reportData?.generation?.introduction || 'This report presents the findings from an assessment of the organization\'s data protection compliance...'}
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Results derived from your responses to questions for each track
          </h2>
          <RadarChartSection />
        </div>

        <div className="mb-16">
          <SnapshotSection />
        </div>

        {/* Recommendation Section based on dynamic data */}
        {findings.map((finding, index) => (
          <RecommendationSection
            key={index}
            title={finding.title}
            findings={finding.recommendations_for_improvement}
          />
        ))}
      </main>
    </div>
  );
};

export default SOC1Report;