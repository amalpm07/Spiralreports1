import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';

// Custom Hook to Fetch Assessment Data
const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  const access_token = authData?.accessToken;
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('https://app.spiralreports.com/api/evaluations?page=1&limit=10&orderBy=desc', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.statusCode === 200) {
          setAssessments(data.data.data); // Store the fetched assessments data
        } else {
          setError(data.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false); // Set loading to false once data is fetched or an error occurs
      }
    };

    fetchAssessments();
  }, [access_token]); // Re-run the effect if access_token changes

  return { assessments, loading, error };
};

export default useAssessments;
