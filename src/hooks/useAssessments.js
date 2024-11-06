// useAssessments.js
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';

const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  const access_token = authData?.accessToken;
  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://app.spiralreports.com/api/evaluations?page=1&limit=10&orderBy=desc', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }

        const data = await response.json();
        setAssessments(data.evaluations || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [access_token]);

  return { assessments, loading, error };
};

export default useAssessments;
