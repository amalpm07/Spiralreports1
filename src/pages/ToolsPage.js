import React from 'react';
import { Infinity, Database, AlertCircle, Phone, Shield, BarChart3 } from 'lucide-react';




// Section component for wrapping content with customizable background and padding
const Section = ({ children, bgColor = "bg-white", className = "" }) => (
  <div className={`${bgColor} px-4 py-16 ${className}`}>
    <div className="max-w-4xl mx-auto">
      {children}
    </div>
  </div>
);

// SectionHeader component to render section titles and subtitles
const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center">
    <Infinity className="w-12 h-12 mx-auto mb-4" aria-label="Infinity icon" />
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
  </div>
);

// BulletPoint component for rendering list items consistently
const BulletPoint = ({ children }) => (
  <li className="flex items-start gap-3">
    <div className="mt-2">
      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
    </div>
    <p className="text-gray-700 leading-relaxed">{children}</p>
  </li>
);

// ToolCard component to display tool info, either current or recommended
const ToolCard = ({ tool, type }) => (
  <div className="bg-gray-50 rounded-lg p-8 shadow-sm h-full">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-2 bg-red-100 rounded-lg">
        {/* Render icon directly */}
        {tool.icon && <tool.icon className="w-6 h-6 text-red-500" />}
      </div>
      <h3 className={`${type === 'current' ? 'text-2xl' : 'text-xl'} font-bold text-red-500`}>
        {tool.name}
      </h3>
    </div>

    {type === 'current' ? (
      <ul className="space-y-3">
        {tool.description.map((desc, index) => (
          <BulletPoint key={index}>{desc}</BulletPoint>
        ))}
      </ul>
    ) : (
      <div className="space-y-6">
        <div>
          <h4 className="text-red-500 font-medium mb-3">Suggestions</h4>
          <ul className="space-y-3">
            {tool.suggestions.map((suggestion, index) => (
              <BulletPoint key={index}>{suggestion}</BulletPoint>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-red-500 font-medium mb-3">Purpose</h4>
          <p className="text-gray-700">{tool.purpose}</p>
        </div>
      </div>
    )}
  </div>
);

// ToolsPage component, the main page layout
const ToolsPage = ({ reportData }) => {
    console.log(reportData);
  
    // Extract recommended cybersecurity products from the report data
    const recommendedTools = reportData?.generation?.recommendations_for_cybersecurity_tools.recommended_cybersecurity_products
     || [];
  console.log(recommendedTools);
  
    // Data for tools in use (example)
    const currentTools = [
      {
        id: 1,
        name: 'SADA',
        description: [
          'Utilize SADA for tracking BCM metrics and KPIs effectively.',
          'Leverage SADA for documenting roles and responsibilities and ensuring they are communicated clearly.',
          'Use SADA to create a centralized repository for the BCM framework and policies.'
        ],
        icon: Database
      }
    ];
  
    return (
      <div className="min-h-screen bg-white">
        {/* Section for current tools in use */}
        <Section bgColor="bg-red-500" className="text-white">
          <SectionHeader
            title="Tools Currently in Use"
            subtitle="Suggested Best Practices for the tools currently being utilized"
          />
        </Section>
  
        <Section>
          {currentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} type="current" />
          ))}
        </Section>
  
        {/* Section for additional tool recommendations */}
        <Section bgColor="bg-gray-900" className="text-white">
          <SectionHeader title="Additional Tool Recommendations" />
        </Section>
  
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recommendedTools.map((tool, index) => (
              <ToolCard
                key={index}
                tool={{
                  name: tool.product_name,
                  suggestions: tool.examples,
                  purpose: tool.purpose,
                  icon: AlertCircle // You can modify this part to dynamically select icons based on the product
                }}
                type="recommended"
              />
            ))}
          </div>
        </Section>
  
        {/* Section for total assessment maturity score */}
        <Section bgColor="bg-red-500" className="text-white">
          <div className="text-center">
            <Infinity className="w-12 h-12 mx-auto mb-6" aria-label="Infinity icon" />
            <h2 className="text-2xl font-medium mb-4">Total Assessment Maturity Score is</h2>
            <p className="text-7xl font-bold">{reportData?.generation?.total_assessment_maturity?.overall_maturity_level || '0%'}</p>
          </div>
        </Section>
  
        {/* Section for threats */}
        <Section>
          <SectionHeader title="List Of Threats" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {reportData?.generation?.list_of_threats.map((threat, index) => (
              <div
                key={index}
                className={`bg-gray-50 rounded-lg p-8 text-center ${index % 2 === 0 ? 'md:col-span-2' : ''}`}
              >
                <p className="text-gray-800 text-lg">{threat}</p>
              </div>
            ))}
          </div>
        </Section>

      {/* Conclusion Section with a call to action */}
      <div className="bg-red-500 relative">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-white text-center mb-32">
            <SectionHeader title="Conclusion" />
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              Improving the maturity of the Business Continuity Management program is critical 
              for ensuring organizational resilience. By addressing the identified gaps and implementing 
              the recommended improvements, the organization can significantly enhance its ability to 
              manage disruptions effectively and protect its interests.
            </p>
          </div>

          <div className="bg-white rounded-xl p-16 text-center shadow-2xl mx-auto max-w-3xl relative z-10">
            <h3 className="text-gray-900 text-4xl font-bold mb-10">
              Want To Level Up Your Compliance?
            </h3>
            <button className="bg-red-500 text-white px-10 py-5 rounded-full hover:bg-red-600 transition-all duration-200 font-medium text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Schedule a call with us
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from getting hidden under the fixed footer */}
      <div className="bg-white h-24" />
    </div>
  );
};

export default ToolsPage;
