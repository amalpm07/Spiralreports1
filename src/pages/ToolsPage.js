import React from 'react';
import { Infinity, AlertCircle, Code } from 'lucide-react';

const Section = ({ children, bgColor = "bg-white", className = "" }) => (
  <div className={`${bgColor} px-4 py-16 ${className}`}>
    <div className="max-w-4xl mx-auto">
      {children}
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center">
    <Infinity className="w-12 h-12 mx-auto mb-4" aria-label="Infinity icon" />
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
  </div>
);

const BulletPoint = ({ children }) => (
  <li className="flex items-start gap-3">
    <div className="mt-2">
      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
    </div>
    <p className="text-gray-700 leading-relaxed">{children}</p>
  </li>
);

const ToolCard = ({ tool }) => (
  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
    <div className="absolute -top-3 right-6">
      <span className="inline-block bg-red-50 px-4 py-1.5 rounded-full text-xs font-semibold text-red-500 tracking-wide">
        {tool.tag || 'Tool'}
      </span>
    </div>
    
    <div className="flex items-start gap-5 mb-10">
      <div className="p-3.5 bg-red-50 rounded-lg flex-shrink-0">
        {tool.icon && <tool.icon className="w-7 h-7 text-red-500" />}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 leading-tight pt-2">
        {tool.name || tool.product_name}
      </h3>
    </div>
    
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">
          Key Features
        </h4>
        <ul className="space-y-4">
          {(tool.examples || tool.recommendations)?.length > 0 ? (
            (tool.examples || [tool.recommendations]).map((suggestion, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>
                <p className="text-base text-gray-600 leading-relaxed">
                  {suggestion}
                </p>
              </li>
            ))
          ) : (
            <p className="text-base text-gray-500 italic">No features available</p>
          )}
        </ul>
      </div>
      
      <div>
        <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest">
          Overview
        </h4>
        <p className="text-base text-gray-600 leading-relaxed">
          {tool.purpose || tool.description}
        </p>
      </div>
    </div>
  </div>
);

const ToolsPage = ({ reportData }) => {
  const generation = reportData?.generation || reportData?.data?.generation;
  const recommendedTools = generation?.recommendations_for_cybersecurity_tools?.recommended_cybersecurity_products;
  const currentTools = generation?.recommendations_for_cybersecurity_tools?.current_tools;
  const conclusion = generation?.conclusion;

  const noCurrentToolsMessage = "No tools currently in use";

  return (
    <div className="min-h-screen bg-white">
      <Section bgColor="bg-red-500" className="text-white">
        <SectionHeader
          title="Tools Currently in Use"
          subtitle="Suggested Best Practices for the tools currently being utilized"
        />
      </Section>

      <Section>
        {Array.isArray(currentTools) && currentTools.length > 0 ? (
          currentTools.map((tool) => (
            <ToolCard
              key={tool.tool_name}
              tool={{
                name: tool.tool_name,
                purpose: tool.recommendations,
                icon: AlertCircle,
                tag: "Current Tool"
              }}
            />
          ))
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <p className="text-gray-700 text-lg">{noCurrentToolsMessage}</p>
          </div>
        )}
      </Section>

      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Infinity className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-16">Additional Tool Recommendations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {Array.isArray(recommendedTools) && recommendedTools.length > 0 ? (
              recommendedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={{
                    ...tool,
                    icon: Code,
                    tag: "Recommended"
                  }}
                />
              ))
            ) : (
              <p className="text-gray-700">No additional tool recommendations available.</p>
            )}
          </div>
        </div>
      </div>

      <Section bgColor="bg-red-500" className="text-white">
        <div className="text-center">
          <Infinity className="w-12 h-12 mx-auto mb-6" aria-label="Infinity icon" />
          <h2 className="text-2xl font-medium mb-4">Total Assessment Maturity Score is</h2>
          <p className="text-7xl font-bold">{generation?.total_assessment_maturity?.overall_maturity_level || '0%'}</p>
        </div>
      </Section>

      <Section>
        <div className="bg-white py-2 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Infinity className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-16">List Of Threats</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {Array.isArray(generation?.list_of_threats) && generation?.list_of_threats.length > 0 ? (
                generation.list_of_threats.map((threat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 text-center h-full flex items-center justify-center"
                  >
                    <p className="text-gray-800 text-sm font-medium">{threat}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">No threats listed.</p>
              )}
            </div>
          </div>
        </div>
      </Section>

      <div className="bg-red-500 relative">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-white text-center mb-32">
            <SectionHeader title="Conclusion" />
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              {conclusion}
            </p>
          </div>

          <div className="bg-white rounded-xl p-16 text-center shadow-2xl mx-auto max-w-3xl relative z-10">
            <h3 className="text-gray-900 text-4xl font-bold mb-10">
              Want To Level Up Your Compliance?
            </h3>

            <a
              href="https://spiralreports.com/contact-us"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-red-500 text-white px-10 py-5 rounded-full hover:bg-red-600 transition-all duration-200 font-medium text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Schedule a call with us
              </button>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white h-24" />
    </div>
  );
};

export default ToolsPage;