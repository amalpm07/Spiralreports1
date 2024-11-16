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
const SnapshotSection = memo(({ findings }) => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-6 p-4 bg-white rounded-full shadow-md border border-gray-200">
          <span className="text-red-500 text-3xl font-bold">∞</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Here's the latest SOC 1 snapshot,
          <br />
          tailored from your inputs!
        </h2>
        <div className="w-16 h-1 mx-auto mt-4 bg-red-500 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {findings.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm transition-transform duration-200 hover:shadow-md hover:-translate-y-1"
          >
            <h3 className="text-red-500 font-semibold text-lg border-b border-gray-200 pb-2 mb-4">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {item.current_state}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});
const CircleProgress = ({ percentage }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth="12"
      />
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke="#EF4444"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
};

const Dashboard = memo(({ generation, transformedData, intro }) => {
  const readinessScore = generation?.total_assessment_maturity?.overall_maturity_level || 0;
  
  const styles = {
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '96px 32px 32px',
      background: 'linear-gradient(145deg, #f8fafc, #ffffff)',
      minHeight: '100vh',
    },
    flexContainer: {
      display: 'flex',
      gap: '32px',
      '@media (max-width: 1024px)': {
        flexDirection: 'column',
      },
    },
    mainContent: {
      flex: 1,
    },
    headerSection: {
      marginBottom: '48px',
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '16px',
      color: '#111827',
    },
    redText: {
      color: '#EF4444',
    },
    description: {
      color: '#4B5563',
      maxWidth: '56rem',
    },
    chartSection: {
      marginBottom: '64px',
    },
    chartHeader: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    infinitySymbol: {
      fontSize: '24px',
    },
    chartTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginTop: '16px',
    },
    chartContainer: {
      height: '400px',
      width: '100%',
    },
    sidebar: {
      width: '360px',
      flexShrink: 0,
      '@media (max-width: 1024px)': {
        width: '100%',
      },
    },
    card: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.1)',
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px',
    },
    cardSubtitle: {
      fontSize: '14px',
      color: '#6B7280',
    },
    progressContainer: {
      position: 'relative',
      width: '180px',
      height: '180px',
      margin: '0 auto 40px',
    },
    progressText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    },
    progressPercentage: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827',
    },
    progressLabel: {
      fontSize: '14px',
      color: '#6B7280',
      marginTop: '4px',
    },
    divider: {
      height: '1px',
      background: 'linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
      margin: '24px 0',
    },
    categoriesSection: {
      padding: '0 8px',
    },
    categoriesHeader: {
      marginBottom: '24px',
    },
    categoriesTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '4px',
    },
    categoriesSubtitle: {
      fontSize: '13px',
      color: '#6B7280',
    },
    categoryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      marginBottom: '12px',
      borderRadius: '12px',
      background: 'linear-gradient(to right, rgba(239, 68, 68, 0.03), transparent)',
      border: '1px solid rgba(239, 68, 68, 0.08)',
    },
    categoryLabel: {
      fontSize: '14px',
      color: '#4B5563',
    },
    categoryScore: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#EF4444',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.flexContainer}>
        <div style={styles.mainContent}>
          <div style={styles.headerSection}>
            <h1 style={styles.title}>
              Your total readiness for <span style={styles.redText}>SOC 1</span> stands at{' '}
              <span style={styles.redText}>{readinessScore}%</span>
            </h1>
            <p style={styles.description}>
              {intro || 'No introduction available.'}
            </p>
          </div>
          
          <div style={styles.chartSection}>
            <div style={styles.chartHeader}>
              <span style={styles.infinitySymbol}>∞</span>
              <h2 style={styles.chartTitle}>
                Results derived from your responses to questions for each track
              </h2>
            </div>
            <div style={styles.chartContainer}>
              <ResponsiveContainer>
                <RadarChart data={transformedData}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fill: '#4B5563', fontSize: 12 }} 
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 12]} />
                  <Radar 
                    name="Current Score" 
                    dataKey="currentScore" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="Target Score" 
                    dataKey="targetScore" 
                    stroke="#48BB78" 
                    fill="#48BB78" 
                    fillOpacity={0.2} 
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <aside style={styles.sidebar}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Your Readiness Score</h3>
              <p style={styles.cardSubtitle}>SOC 1 Assessment Progress</p>
            </div>

            <div style={styles.progressContainer}>
              <CircleProgress percentage={readinessScore} />
              <div style={styles.progressText}>
                <div style={styles.progressPercentage}>{readinessScore}%</div>
                <div style={styles.progressLabel}>Complete</div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.categoriesSection}>
              <div style={styles.categoriesHeader}>
                <h4 style={styles.categoriesTitle}>Readiness by category</h4>
                <p style={styles.categoriesSubtitle}>
                  Your readiness from your responses
                </p>
              </div>

              {transformedData?.map((category, index) => (
                <div key={index} style={styles.categoryItem}>
                  <span style={styles.categoryLabel}>
                    {category.category}
                  </span>
                  <span style={styles.categoryScore}>
                    {category.currentScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
});

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