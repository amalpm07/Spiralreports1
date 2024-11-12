import React from 'react';
import { Card } from '../components/ui/Card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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

const SnapshotSection = () => (
  <div className="grid grid-cols-2 gap-8">
    <div className="space-y-4">
      <h3 className="text-red-400 font-semibold">Formal Organizational Commitment to BCM</h3>
      <p className="text-gray-600">Limited roles and responsibilities for the Business Continuity program; no executive sponsorship.</p>
    </div>
    <div className="space-y-4">
      <h3 className="text-red-400 font-semibold">Tracking and Reporting of Key Performance Indicators (KPIs)</h3>
      <p className="text-gray-600">BCM metrics and KPIs are reported only upon request.</p>
    </div>
    <div className="space-y-4">
      <h3 className="text-red-400 font-semibold">Crisis Management Plan and Team</h3>
      <p className="text-gray-600">Limited crisis management protocol and team in place.</p>
    </div>
    <div className="space-y-4">
      <h3 className="text-red-400 font-semibold">Staff Experience and Budget for BCM Initiatives</h3>
      <p className="text-gray-600">Business Continuity resources exist in partial roles; minimal budget allocated.</p>
    </div>
  </div>
);

const RecommendationSection = ({ title, items, priorityData }) => (
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
            {items.map((item, index) => (
              <div key={index} className="mb-8">
                <div className="flex">
                  <span className="text-red-400 font-bold mr-4">{index + 1}</span>
                  <div>
                    <h4 className="text-red-400 font-semibold">{item.title}</h4>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="w-48 h-48 mx-auto">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {priorityData.map((item, index) => (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={`${item.percentage * 251.2 / 100} 251.2`}
                    transform={`rotate(${item.rotation} 50 50)`}
                    />
                ))}
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-400 mr-2"></span>
              <span className="text-sm">High</span>
              <span className="h-3 w-3 rounded-full bg-yellow-400 mx-2"></span>
              <span className="text-sm">Medium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SOC1Report = () => {
  const orgCommitmentItems = [
    {
      title: "Establish Executive Sponsorship",
      description: "Secure commitment from senior management to actively support and sponsor the BCM program."
    },
    {
      title: "Define Roles and Responsibilities",
      description: "Document and communicate clear roles and responsibilities for all members involved in the BCM program."
    },
    {
      title: "Create a Governance Structure",
      description: "Establish a formal governance framework for the BCM program, including a dedicated committee to oversee operations."
    },
    {
      title: "Document the BCM Framework",
      description: "Formulate and disseminate a comprehensive BCM framework and policy across the organization."
    },
    {
      title: "Regular Engagement from Senior Management",
      description: "Ensure ongoing involvement and commitment from senior management to the BCM program."
    }
  ];

  const kpiItems = [
    {
      title: "Establish Periodic Reporting",
      description: "Implement a schedule for regular tracking and reporting of BCM metrics and KPIs to senior management."
    },
    {
      title: "Integrate Reporting Across Departments",
      description: "Develop a mechanism to ensure that BCM metrics are reported consistently across all departments."
    },
    {
      title: "Engage the BC Steering Committee",
      description: "Regularly inform the BC Steering Committee of the BCM program's progress and performance metrics."
    },
    {
      title: "Define Clear KPIs",
      description: "Identify and define specific KPIs that align with the organization's BCM objectives."
    },
    {
      title: "Utilize Dashboard for Visibility",
      description: "Create a visual dashboard for real-time tracking and reporting of BCM performance metrics."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Your total readiness for <span className="text-red-400">SOC 1</span> stands at <span className="text-red-400">0%</span>
          </h1>
          <p className="text-gray-600">
            This report presents the findings from the SOC 1 assessment conducted on the Business Continuity Plan, 
            specifically focusing on governance and organization. The assessment revealed significant gaps and 
            opportunities for improvement in the organization's Business Continuity Management (BCM) practices. Our aim is 
            to provide actionable recommendations to enhance the maturity of the BCM framework and ensure better 
            preparedness against potential disruptions.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Results derived from your responses to questions for each track
          </h2>
          <RadarChartSection />
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Here's the latest SOC 1 snapshot, tailored from your inputs!
          </h2>
          <SnapshotSection />
        </div>

        <RecommendationSection
          title="Formal Organizational Commitment to BCM"
          items={orgCommitmentItems}
          priorityData={[
            { color: "#f87171", percentage: 60, rotation: 0 },
            { color: "#fbbf24", percentage: 40, rotation: 216 }
          ]}
        />

        <RecommendationSection
          title="Tracking and Reporting of Key Performance Indicators (KPIs)"
          items={kpiItems}
          priorityData={[
            { color: "#fbbf24", percentage: 80, rotation: 0 },
            { color: "#86efac", percentage: 20, rotation: 288 }
          ]}
        />
      </main>
    </div>
  );
};

export default SOC1Report;