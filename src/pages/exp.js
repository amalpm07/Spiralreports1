import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ToolsPage from './ToolsPage';
import { useLocation } from 'react-router-dom';
// Data structures
const assessmentData = {
  categories: {
    organizational: {
      title: "Formal Organizational Commitment to BCM",
      pieData: [
        { name: 'High', value: 60, color: '#f87171' },
        { name: 'Medium', value: 40, color: '#fcd34d' }
      ],
      recommendations: [
        { id: 1, title: "Establish Executive Sponsorship", description: "Secure commitment from senior management to actively support and sponsor the BCM program.", priority: "High" },
        { id: 2, title: "Define Roles and Responsibilities", description: "Document and communicate clear roles and responsibilities for all members involved in the BCM program.", priority: "Medium" },
        { id: 3, title: "Create a Governance Structure", description: "Establish a formal governance framework for the BCM program, including a dedicated committee to oversee operations.", priority: "High" },
        { id: 4, title: "Document the BCM Framework", description: "Formulate and disseminate a comprehensive BCM framework and policy across the organization.", priority: "Medium" },
        { id: 5, title: "Regular Engagement from Senior Management", description: "Ensure ongoing involvement and commitment from senior management to the BCM program.", priority: "High" }
      ]
    },
    kpi: {
      title: "Tracking and Reporting of Key Performance Indicators (KPIs)",
      pieData: [
        { name: 'Medium', value: 80, color: '#fcd34d' },
        { name: 'Low', value: 20, color: '#86efac' }
      ],
      recommendations: [
        { id: 1, title: "Establish Periodic Reporting", description: "Implement a schedule for regular tracking and reporting of BCM metrics and KPIs to senior management.", priority: "Medium" },
        { id: 2, title: "Integrate Reporting Across Departments", description: "Develop a mechanism to ensure that BCM metrics are reported consistently across all departments.", priority: "Medium" },
        { id: 3, title: "Engage the BC Steering Committee", description: "Regularly inform the BC Steering Committee of the BCM program's progress and performance metrics.", priority: "Low" },
        { id: 4, title: "Define Clear KPIs", description: "Identify and define specific KPIs that align with the organization's BCM objectives.", priority: "Medium" },
        { id: 5, title: "Utilize Dashboard for Visibility", description: "Create a visual dashboard for real-time tracking and reporting of BCM performance metrics.", priority: "Medium" }
      ]
    },
    crisis: {
      title: "Crisis Management Plan and Team",
      pieData: [
        { name: 'High', value: 60, color: '#f87171' },
        { name: 'Medium', value: 40, color: '#fcd34d' }
      ],
      recommendations: [
        { id: 1, title: "Develop a Comprehensive Crisis Management Plan", description: "Create a documented crisis management plan that outlines processes and protocols.", priority: "High" },
        { id: 2, title: "Establish a Dedicated Crisis Management Team", description: "Form a crisis management team with clearly defined roles and responsibilities.", priority: "High" },
        { id: 3, title: "Review and Update the CMP Annually", description: "Ensure that the crisis management plan is annually reviewed and updated based on lessons learned.", priority: "Medium" },
        { id: 4, title: "Conduct Regular Drills and Exercises", description: "Implement regular training drills and tabletop exercises to test the crisis management plan.", priority: "High" },
        { id: 5, title: "Document Crisis Protocols", description: "Formally document crisis escalation and incident management protocols to ensure consistency.", priority: "Medium" }
      ]
    },
    staff: {
      title: "Staff Experience and Budget for BCM Initiatives",
      pieData: [
        { name: 'High', value: 60, color: '#f87171' },
        { name: 'Medium', value: 40, color: '#fcd34d' }
      ],
      recommendations: [
        { id: 1, title: "Form a Dedicated BCM Team", description: "Create a dedicated Business Continuity team with clearly defined roles and responsibilities.", priority: "High" },
        { id: 2, title: "Allocate Sufficient Budget", description: "Ensure an annual budget is allocated for BCM initiatives that aligns with planned activities.", priority: "Medium" },
        { id: 3, title: "Enhance Staff Training and Skills", description: "Provide training for the BCM team to develop necessary skills and competencies.", priority: "Medium" },
        { id: 4, title: "Identify and Recruit BCM Professionals", description: "Identify and recruit individuals with expertise in Business Continuity Management.", priority: "High" },
        { id: 5, title: "Align Resources with BCM Goals", description: "Ensure that team resources are adequately aligned with the goals of the BCM program.", priority: "Medium" }
      ]
    }
  },
  radarData: [
    { category: 'Formal Guidance', currentScore: 2, targetScore: 12 },
    { category: 'Tracking and KPIs', currentScore: 2, targetScore: 12 },
    { category: 'Crisis Management', currentScore: 2, targetScore: 12 },
    { category: 'Staff Experience', currentScore: 2, targetScore: 12 }
  ]
};

// eslint-disable-next-line no-unused-vars
const snapshotData = [
  {
    title: "Formal Organizational Commitment to BCM",
    description: "Limited roles and responsibilities for the Business Continuity program; no executive sponsorship."
  },
  {
    title: "Tracking and Reporting of Key Performance Indicators (KPIs)",
    description: "BCM metrics and KPIs are reported only upon request."
  },
  {
    title: "Crisis Management Plan and Team",
    description: "Limited crisis management protocol and team in place."
  },
  {
    title: "Staff Experience and Budget for BCM Initiatives",
    description: "Business Continuity resources exist in partial roles; minimal budget allocated."
  }
];

const SOC1Assessment = () => {
  const Header = () => (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 flex justify-between h-16">
        <div className="flex items-center gap-4">
          <img src="/api/placeholder/120/40" alt="Logo" className="h-8" />
          <input type="text" defaultValue="qwd" className="border-none bg-transparent text-gray-600" readOnly />
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

  const RenderPieChart = ({ data }) => (
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
                <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={4} />
              ))}
            </Pie>
            {data.map((entry, index) => (
              <text
                key={`text-${index}`}
                x="50%"
                y={index === 0 ? "30%" : "70%"}
                textAnchor="middle"
                fill={entry.color}
                fontSize={14}
              >
                {`${entry.value}%`}
              </text>
            ))}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  

  const RecommendationSection = ({ category, piePosition = 'right', reportData }) => {
    // Extract the relevant recommendations for the current category
    const findings = reportData?.generation?.summary_of_findings || [];
    const categoryRecommendations = findings.find(f => f.title === category.title)?.recommendations_for_improvement || [];
  
    return (
      <>
        <div className="bg-red-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <span className="text-2xl">∞</span>
            <h2 className="text-2xl font-bold mt-4">RECOMMENDATION</h2>
            <h3 className="text-4xl font-bold mt-4">{category.title}</h3>
          </div>
        </div>
  
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex gap-16">
            {piePosition === 'left' && <RenderPieChart data={category.pieData} />}
            <div className="flex-1">
              {categoryRecommendations.length > 0 ? (
                categoryRecommendations.map((rec, index) => (
                  <div key={index} className="mb-12 flex gap-8">
                    <span className="text-gray-400 text-xl">{index + 1}</span>
                    <div>
                      <h4 className="text-red-500 font-medium mb-2">{rec.recommendation_title}</h4>
                      <p className="text-gray-600">{rec.recommendation_description}</p>
                      <div className="mt-2">
                        <span className={`text-sm font-bold ${rec.risk === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>
                          Risk Level: {rec.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recommendations available for this category.</p>
              )}
              <div className="flex gap-8 mt-8">
                {category.pieData.map(entry => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {piePosition === 'right' && <RenderPieChart data={category.pieData} />}
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

  const SnapshotSection = () => {
    const location = useLocation();
    const reportData = location.state?.reportData || {};  // Default to empty object if not available
    const findings = reportData?.generation?.summary_of_findings || [];
  console.log(reportData);
  
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Dashboard />
        <SnapshotSection />
        {Object.entries(assessmentData.categories).map(([key, category], index) => (
          <RecommendationSection 
            key={key}
            category={category}
            piePosition={index % 2 === 0 ? 'right' : 'left'}
          />
        ))}
        <ToolsPage/>
      </main>
    </div>
  );
};

export default SOC1Assessment;














