import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const COMPLIANCE_FRAMEWORKS = [
  { id: 'iso27001', name: 'ISO 27001' },
  { id: 'gdpr', name: 'GDPR' },
  { id: 'hipaa', name: 'HIPAA' },
  { id: 'pci', name: 'PCI DSS' },
  { id: 'sox', name: 'Sarbanes-Oxley (SOX)' },
  { id: 'nist', name: 'NIST Cybersecurity Framework' },
];

function ConfigureAssessment({ assessment, onBack, onSubmit }) {
  const [selectedFramework, setSelectedFramework] = useState('');
  const [customName, setCustomName] = useState(assessment.name || '');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle submit for starting the assessment and navigating to the quiz page
  const handleStartAssessment = () => {
    // You can perform additional logic here, like saving the selected framework or custom name
    navigate('/assessmentsquiz', {
      state: { // Passing state to the destination route
        assessment: {
          ...assessment,
          name: customName, 
          framework: selectedFramework
        }
      }
    });
  };
  

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Configure Assessment</h2>
        <p className="text-gray-600">Customize your assessment settings</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="assessment-name" className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Name
          </label>
          <input
            id="assessment-name"
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder="Enter assessment name"
          />
        </div>

        {/* Compliance Framework Dropdown */}
        <div>
          <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-2">
            Compliance Framework
          </label>
          <div className="relative">
            <select
              id="framework"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option value="">Select a framework...</option>
              {COMPLIANCE_FRAMEWORKS.map((framework) => (
                <option key={framework.id} value={framework.id}>
                  {framework.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleStartAssessment} // Call handleStartAssessment on button click
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}

export default ConfigureAssessment;
