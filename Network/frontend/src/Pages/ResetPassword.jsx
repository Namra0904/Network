import React from 'react'
import logo from '../assets/Images/logo_icon.png';
import eye from '../assets/Images/eye.png';
import { ResetPasswordSchema } from '../utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
} = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'onChange',
});

const [errorMessage, setErrorMessage] = useState('');
const navigate = useNavigate()

const onSubmit = async (data) => {
  try {
      const response = await axios({
          method: 'POST',
          url: 'http://127.0.0.1:8000/reset_password/<str:token>/',
          headers: {
              'Content-Type': 'application/json',
          },
          data: {
              password: data.password,
          },
      });
      if (response.status === 200) {
         console.log(response.data)
         navigate('/login')
      }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
          setErrorMessage(error.response.data.error);
      } else {
          console.error('An error occurred. Please try again later.');
      }
  } else {
    console.log(error)
      console.error('An unexpected error occurred.');
  }
  }
};

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="bg-white rounded p-4 shadow-sm bg-light" style={{ maxWidth: '400px', width: '80%' }}>
      <div className="text-center mb-3">
        {/* <div className="d-flex justify-content-center align-items-center">
          <img src={logo} alt="Logo" height="50em" style={{ marginBottom: '1vh' }} />
          <h2 className="ms-2 mt-1" style={{ fontSize: '2.2rem', color: '#1e5b85', fontFamily: 'sans-serif'}}>
                  <b><b>Network</b></b>
          </h2>
        </div> */}
        {/* <img src={eye} alt="Logo" height="50em" style={{ marginBottom: '' }} /> */}
        <img src={logo} alt="Logo" height="50em" style={{ marginBottom: '1vh' }} />
        <p style={{fontSize:'1.6rem', color: '#1e5b85'}} className='mb-1'><b>Reset Password</b></p>
        <p className="text-center" style={{ fontSize: '14px' }}>
        Create a new password for your account. Make sure it’s strong and easy for you to remember.
          </p>
      </div>
  
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
          <input
            type="password"
             name="password"
            {...register('password')}
            className="form-control form-control-sm"
            placeholder="Password *"
           
          />
          {errors.password && (
            <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="confirmPassword"
            {...register('confirmPassword')}
            className="form-control form-control-sm"
            placeholder="Confirm Password *"
            
          />
          {errors.confirmPassword && (
            <div className="text-danger mt-2" style={{ fontSize: 'small' }}>
              {errors.confirmPassword.message}
            </div>
          )}
         {errorMessage && (
          <div className="text-danger mt-2 mb-2" style={{ fontSize: 'small' }}>
              {errorMessage}
          </div> )}
        <button type="submit" className="mt-3 btn-success btn w-100" >
                <b>Reset Password</b>
              </button>
        </div>
       
      </form>
    </div>
  </div>
  
  )
}

export default ResetPassword