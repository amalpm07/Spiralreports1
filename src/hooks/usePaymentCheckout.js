import { useState } from 'react';
import { useAuth } from '../hooks/AuthContext'; // Importing the useAuth hook

const usePaymentCheckout = () => {
  const { authData } = useAuth(); // Get auth data from context
  const access_token = authData?.accessToken; // Extract access token from authData
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const checkout = async (quantity) => {
    setLoading(true);
    setError(null);

    if (!access_token) {
      setError('Authentication token is missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://app.spiralreports.com/api/payments/checkout', {
        method: 'POST', // Using GET method as specified
        headers: {
          'Authorization': `Bearer ${access_token}`, // Adding the Authorization header with the token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }), // Send quantity in the request body
      });

      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        setCheckoutUrl(data.data.url); // Get the URL for the checkout
        setTransactionId(data.data.id); // Store the transaction ID for later use
      } else {
        throw new Error(data.message || 'An error occurred during payment checkout.');
      }
    } catch (err) {
      setError(err.message); // Set the error message if any
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return {
    loading,
    error,
    checkoutUrl,
    transactionId,
    checkout,
  };
};

export default usePaymentCheckout;
