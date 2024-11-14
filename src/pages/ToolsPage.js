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
// ToolCard component to display tool info, either current or recommended
const ToolCard = ({ tool, type }) => (
  <div className="bg-gray-50 rounded-lg p-8 shadow-sm h-full">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-2 bg-red-100 rounded-lg">
        {/* Render icon directly if available */}
        {tool.icon && <tool.icon className="w-6 h-6 text-red-500" />}
      </div>
      <h3 className={`${type === 'current' ? 'text-2xl' : 'text-xl'} font-bold text-red-500`}>
        {tool.name}
      </h3>
    </div>

    {type === 'current' ? (
      // Check if 'description' is an array and is not undefined
      Array.isArray(tool.description) && tool.description.length > 0 ? (
        <ul className="space-y-3">
          {tool.description.map((desc, index) => (
            // Use a unique key if possible, otherwise fall back to index
            <BulletPoint key={desc || index}>{desc}</BulletPoint>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No description available.</p>
      )
    ) : (
      <div className="space-y-6">
        <div>
          <h4 className="text-red-500 font-medium mb-3">Suggestions</h4>
          {/* Check if 'suggestions' is an array and is not undefined */}
          {Array.isArray(tool.suggestions) && tool.suggestions.length > 0 ? (
            <ul className="space-y-3">
              {tool.suggestions.map((suggestion, index) => (
                // Use a unique key if possible, otherwise fall back to index
                <BulletPoint key={suggestion || index}>{suggestion}</BulletPoint>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No suggestions available.</p>
          )}
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
  // Ensure reportData is defined before accessing its properties
  const generation = reportData?.generation || reportData?.data?.generation;

  // Extract recommended cybersecurity products from the report data
  const recommendedTools = generation?.recommendations_for_cybersecurity_tools?.recommended_cybersecurity_products;
  const currentTools = generation?.recommendations_for_cybersecurity_tools?.current_tools;
  console.log(currentTools);
  
  const conclusion = generation?.conclusion;

  const noCurrentToolsMessage = "No tools currently in use";

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
  {/* Check if there are current tools */}
  {Array.isArray(currentTools) && currentTools.length > 0 ? (
    currentTools.map((tool) => (
      <ToolCard
        key={tool.tool_name} // Use the tool's name as the key if it's unique
        tool={{
          name: tool.tool_name,
          description: tool.recommendations, // Use recommendations as the description
          icon: AlertCircle, // You can choose an appropriate icon for this tool
        }}
        type="current"
      />
    ))
  ) : (
    // If no tools, display the fallback message
    <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
      <p className="text-gray-700 text-lg">{noCurrentToolsMessage}</p>
    </div>
  )}
</Section>

      {/* Section for additional tool recommendations */}
      <Section bgColor="bg-gray-900" className="text-white">
        <SectionHeader title="Additional Tool Recommendations" />
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.isArray(recommendedTools) && recommendedTools.length > 0 ? (
            recommendedTools.map((tool, index) => (
              <ToolCard
                key={index}
                tool={{
                  name: tool.product_name,
                  suggestions: tool.examples || [],
                  purpose: tool.purpose,
                  icon: AlertCircle, // Modify this part to dynamically select icons based on the product
                }}
                type="recommended"
              />
            ))
          ) : (
            <p className="text-gray-700">No additional tool recommendations available.</p>
          )}
        </div>
      </Section>

      {/* Section for total assessment maturity score */}
      <Section bgColor="bg-red-500" className="text-white">
        <div className="text-center">
          <Infinity className="w-12 h-12 mx-auto mb-6" aria-label="Infinity icon" />
          <h2 className="text-2xl font-medium mb-4">Total Assessment Maturity Score is</h2>
          <p className="text-7xl font-bold">{generation?.total_assessment_maturity?.overall_maturity_level || '0%'}</p>
        </div>
      </Section>

      {/* Section for threats */}
      <Section>
        <SectionHeader title="List Of Threats" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {
            // Define the threats array outside JSX
            (() => {
              const threats = Array.isArray(generation?.list_of_threats)
                ? generation?.list_of_threats
                : [];

              if (threats.length > 0) {
                return threats.map((threat, index) => (
                  <div
                    key={index}
                    className={`bg-gray-50 rounded-lg p-8 text-center ${index % 2 === 0 ? 'md:col-span-2' : ''}`}
                  >
                    <p className="text-gray-800 text-lg">{threat}</p>
                  </div>
                ));
              } else {
                return <p className="text-gray-700">No threats listed.</p>;
              }
            })()
          }
        </div>
      </Section>

      {/* Conclusion Section with a call to action */}
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
