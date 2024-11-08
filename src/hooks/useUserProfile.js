/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // To get access token

const useUserProfile = () => {
  const { authData } = useAuth(); // Get the access token from the AuthContext
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const access_token = authData?.access_token || authData?.accessToken;
  console.log(access_token);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
       // Ensure token is available

      try {
        const response = await fetch('https://app.spiralreports.com/api/users/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authData.access_token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data.data); // Set user data
        } else {
          setError(data.message); // Set error message if the request fails
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authData?.accessToken]); // Re-run the effect when accessToken changes

  return { userData, loading, error };
};

export default useUserProfile;
