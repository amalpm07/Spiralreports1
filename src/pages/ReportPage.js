import React, { memo, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import ToolsPage from './ToolsPage';

const riskColors = {
  high: {
    primary: '#ef4444',
    secondary: '#fee2e2'
  },
  medium: {
    primary: '#f97316',
    secondary: '#ffedd5'
  },
  low: {
    primary: '#22c55e',
    secondary: '#dcfce7'
  }
};

const getRiskColor = (risk, type = 'text') => {
  switch (risk.toLowerCase()) {
    case 'high':
      return type === 'text' ? 'text-red-500' : riskColors.high;
    case 'medium':
      return type === 'text' ? 'text-orange-500' : riskColors.medium;
    case 'low':
      return type === 'text' ? 'text-green-500' : riskColors.low;
    default:
      return type === 'text' ? 'text-gray-500' : { primary: '#9ca3af', secondary: '#f3f4f6' };
  }
};

const CustomTooltip = memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    const { recommendation_title, risk } = payload[0].payload;
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900 mb-2">{recommendation_title}</p>
        <p className={`text-sm font-medium ${getRiskColor(risk, 'text')}`}>{risk} Risk</p>
      </div>
    );
  }
  return null;
});

const RenderPieChart = memo(function RenderPieChart({ data, activeIndex, onHover }) {
  const renderCells = useMemo(() => 
    data.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={entry.color}
        opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
        stroke={activeIndex === index ? '#fff' : 'none'}
        strokeWidth={2}
      />
    )), [data, activeIndex]
  );

  const handleMouseEnter = useCallback((_, index) => {
    if (activeIndex !== index) {
      onHover(index);
    }
  }, [activeIndex, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (activeIndex !== null) {
      onHover(null);
    }
  }, [activeIndex, onHover]);

  return (
    <div className="w-96 h-96 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900">{data.length}</h4>
          <p className="text-sm text-gray-500 font-medium">Total Findings</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={85}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={8}
            dataKey="value"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {renderCells}
          </Pie>
          <Tooltip content={CustomTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

const SnapshotSection = memo(({ findings }) => {
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
});

const RecommendationSection = memo(({ title, findings = [], index = 0 }) => {
  const [hoveredRecommendation, setHoveredRecommendation] = useState(null);
  const isEven = index % 2 === 0;

  const pieData = useMemo(() => {
    const sliceValue = 100 / findings.length;
    return findings.map((finding) => {
      const riskColorSet = getRiskColor(finding.risk, 'color');
      return {
        name: finding.recommendation_title,
        value: sliceValue,
        color: riskColorSet.primary,
        ...finding
      };
    });
  }, [findings]);

  const handleHover = useCallback((index) => {
    setHoveredRecommendation(index);
  }, []);

  const Content = memo(() => (
    <div className="flex-1 space-y-6">
      {findings.map((finding, index) => (
        <div
          key={index}
          className={`rounded-xl transition-all duration-300 ${
            hoveredRecommendation === index 
              ? 'bg-gray-50 shadow-sm' 
              : 'bg-white'
          } ${
            hoveredRecommendation !== null && hoveredRecommendation !== index
              ? 'opacity-40'
              : 'opacity-100'
          }`}
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={() => handleHover(null)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {finding.recommendation_title}
                  </h4>
                </div>
                <p className="text-gray-600 leading-relaxed pl-10">
                  {finding.recommendation_description}
                </p>
              </div>
              <div className={`${getRiskColor(finding.risk, 'text')} font-semibold`}>
                {finding.risk} Risk
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ));

  return (
    <div className="bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <span className="inline-block px-4 py-1 bg-red-400/20 rounded-full text-sm font-semibold mb-6">
           Recommendations
          </span>
          <h2 className="text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            {title}
          </h2>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className={`flex gap-16 items-start ${isEven ? '' : 'flex-row-reverse'}`}>
            <div className="flex-shrink-0">
              <RenderPieChart 
                data={pieData} 
                activeIndex={hoveredRecommendation}
                onHover={handleHover}
              />
            </div>
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
});

const Dashboard = memo(({ generation, transformedData, intro }) => (
  <div className="max-w-7xl mx-auto px-8 pt-24 py-8">
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Your total readiness for <span className="text-red-500">SOC 1</span> stands at <span className="text-red-500">{generation?.total_assessment_maturity?.overall_maturity_level || '0%'}</span>
          </h1>
          <p className="text-gray-600 max-w-4xl">
            {intro || 'No introduction available.'}
          </p>
        </div>
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-2xl">∞</span>
            <h2 className="text-2xl font-bold mt-4">Results derived from your responses to questions for each track</h2>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={transformedData}>
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
                <span className="text-4xl font-bold">{generation?.total_assessment_maturity?.overall_maturity_level || '0%'}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-600 mb-1">Readiness by category</h4>
            <p className="text-xs text-gray-500 mb-4">Your readiness from your responses</p>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-red-500 text-xl font-medium">{generation?.total_assessment_maturity?.overall_maturity_level || '0%'}</span>
              <span className="text-gray-700">Governance and organization</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
));

const SOC1Assessment = () => {
  const location = useLocation();
  const reportData = location.state?.reportData || {};
  
  const generation = useMemo(() => 
    reportData?.generation || reportData?.data?.generation,
    [reportData]
  );
  
  const findings = useMemo(() => 
    generation?.summary_of_findings || [],
    [generation]
  );
  
  const intro = useMemo(() => 
    generation?.introduction || "",
    [generation]
  );
  
  const transformedData = useMemo(() => 
    generation?.summary_of_findings?.map(item => ({
      category: item.title,
      currentScore: item.score,
      targetScore: item.next_level_score
    })) || [],
    [generation]
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Dashboard 
          generation={generation}
          transformedData={transformedData}
          intro={intro}
        />
        <SnapshotSection findings={findings} />
        {findings.length > 0 && findings.map((finding, index) => (
          <RecommendationSection
            key={index}
            title={finding.title}
            findings={finding.recommendations_for_improvement || []}
            index={index}
          />
        ))}
        <ToolsPage reportData={reportData} />
      </main>
    </div>
  );
};

export default SOC1Assessment;