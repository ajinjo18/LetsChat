import React from 'react';
import { GoogleLogin as GoogleLoginButton } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"
import { baseUrl } from '../../../utils/baseUrl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsAuthenticated, setIsNotAuthenticated } from '../../../redux/user/user';
import { errorMessage, successMessage } from '../../../utils/toaster';

const GoogleLoginComponent = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Decoded JWT:', decoded);

    const { name, email } = decoded;
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Send the data to the backend
    try {
      const response = await fetch(`${baseUrl}/user/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName
        })
      });

      const data = await response.json();

      if(data.message === 'Login Verified'){
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        dispatch(setIsAuthenticated(data.user))
        successMessage('Login successfully')
        navigate('/')
      }
      if(data.message === 'Blocked User') {
        dispatch(setIsNotAuthenticated())
        errorMessage('Account Blocked')
        navigate('/login')
      }

    } catch (error) {
      console.error('Error during backend request:', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLoginButton
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

export default GoogleLoginComponent;
