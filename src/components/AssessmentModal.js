import React, { useState } from 'react';
import Modal from './Modal';
import AssessmentPurpose from './AssessmentPurpose';
import AssessmentDetails from './AssessmentDetails';
import ConfigureAssessment from './ConfigureAssessment';

function AssessmentModal({ isOpen, setIsOpen, assessment }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    <AssessmentDetails assessment={assessment} onNext={() => setCurrentStep(1)} />,

    <AssessmentPurpose assessment={assessment} onSelectPurpose={() => setCurrentStep(2)} />,
    <ConfigureAssessment
      assessment={assessment}
      onBack={() => setCurrentStep(1)}
      onSubmit={() => setIsOpen(false)} // Close the modal after submit
    />,
  ];

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {steps[currentStep]}
    </Modal>
  );
}

export default AssessmentModal;
