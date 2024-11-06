import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AssessmentQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [tools, setTools] = useState([]);
  const [currentTool, setCurrentTool] = useState('');
  const [showToolsPage, setShowToolsPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const { assessment } = location.state || {}; // Default to empty if no state is passed
  console.log(assessment);

  // Function to get unique options, considering the level of each option
  const getUniqueOptions = (options) => {
    const uniqueOptionsMap = new Map();
    options.forEach(option => {
      const existingOption = uniqueOptionsMap.get(option.text.toLowerCase().trim());
      if (!existingOption || existingOption.level < option.level) {
        uniqueOptionsMap.set(option.text.toLowerCase().trim(), option);
      }
    });
    return Array.from(uniqueOptionsMap.values());
  };

  const currentQuestion = assessment?.questionSet[currentQuestionIndex];
  const totalSteps = assessment?.questionSet.length + 1;
  const progress = showToolsPage ? 100 : ((currentQuestionIndex + 1) / totalSteps) * 100;

  const handleOptionToggle = (optionText) => {
    setSelectedOptions(prev => {
      const currentQuestionSelections = prev[currentQuestionIndex] || [];
      if (currentQuestionSelections.includes(optionText)) {
        return {
          ...prev,
          [currentQuestionIndex]: currentQuestionSelections.filter(text => text !== optionText)
        };
      } else {
        return {
          ...prev,
          [currentQuestionIndex]: [...currentQuestionSelections, optionText]
        };
      }
    });
  };

  const isOptionSelected = (optionText) => {
    return (selectedOptions[currentQuestionIndex] || []).includes(optionText);
  };

  // Check if at least one option is selected
  const isNextButtonDisabled = (selectedOptions[currentQuestionIndex] || []).length === 0;

  const handleNextQuestion = () => {
    if ((selectedOptions[currentQuestionIndex] || []).length === 0) {
      setErrorMessage('Please select at least one option to proceed.');
      return;
    }

    setErrorMessage('');
    if (currentQuestionIndex === assessment?.questionSet.length - 1) {
      setShowToolsPage(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (showToolsPage) {
      setShowToolsPage(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleToolSubmit = (e) => {
    e.preventDefault();
    if (currentTool.trim() && !tools.includes(currentTool.trim())) {
      setTools([...tools, currentTool.trim()]);
      setCurrentTool('');
    }
  };

  const handleToolDelete = (toolToDelete) => {
    setTools(tools.filter(tool => tool !== toolToDelete));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleToolSubmit(e);
    }
  };

  const handleSubmit = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen flex flex-col">
      <div className="bg-white rounded-xl shadow-md p-8 mb-16 flex-grow">
        <div className="mb-8">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!showToolsPage && (
            <>
              <div className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">
                Question {currentQuestionIndex + 1} of {assessment?.questionSet.length}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                {currentQuestion?.question}
              </div>
            </>
          )}
        </div>

        <div className="mb-20">
          {!showToolsPage ? (
            <div className="flex flex-col gap-3">
              {getUniqueOptions(currentQuestion?.options || []).map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleOptionToggle(option.text)}
                  className={`border rounded-lg cursor-pointer transition-all duration-200 overflow-hidden
                    ${isOptionSelected(option.text) ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-start p-4 gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 relative transition-all duration-200
                      ${isOptionSelected(option.text) ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}
                    >
                      {isOptionSelected(option.text) && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-gray-700 text-base leading-relaxed">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tools Assessment</h2>
              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                Please list all the tools that are currently being used in your organization for asset management and security.
              </p>
              <input
                type="text"
                value={currentTool}
                onChange={(e) => setCurrentTool(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a tool name and press Enter"
                className="w-full p-3 rounded-lg border border-gray-300 mb-6 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="flex flex-wrap gap-2 min-h-24">
                {tools.map((tool, index) => (
                  <span key={index} className="inline-flex items-center bg-red-100 px-4 py-2 rounded-md text-sm text-red-900 font-medium">
                    {tool}
                    <button
                      onClick={() => handleToolDelete(tool)}
                      className="ml-2 text-red-900 hover:text-red-800 text-lg p-1"
                      title="Remove tool"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
      </div>

      {/* Sticky Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-between gap-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 && !showToolsPage}
            className={`px-6 py-3 rounded-md text-sm font-medium border border-gray-300 transition-all duration-200
              ${currentQuestionIndex === 0 && !showToolsPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            Previous
          </button>
          
          {!showToolsPage ? (
            <button
              onClick={handleNextQuestion}
              disabled={isNextButtonDisabled}
              className={`px-6 py-3 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200
                ${isNextButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuiz;
