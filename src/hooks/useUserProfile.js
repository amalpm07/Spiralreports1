// src/hooks/useUserProfile.js

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // To get access token
import { useUserContext } from '../context/UserContext'; // Import the UserContext

const useUserProfile = () => {
  const { authData } = useAuth(); // Get the access token from the AuthContext
  const { setUserProfile } = useUserContext(); // Set the user profile in the context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const access_token = authData?.access_token || authData?.accessToken;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!access_token) {
        setLoading(false);
        setError('Access token is missing');
        return;
      }

      try {
        const response = await fetch('https://app.spiralreports.com/api/users/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUserProfile(data.data); // Set user profile in context
        } else {
          setError(data.message || 'Error fetching profile');
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [access_token, setUserProfile]); // Re-run the effect when accessToken changes

  return { loading, error };
};

export default useUserProfile;
