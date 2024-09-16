import React from 'react'
import logo from '../assets/Images/logo_icon.png';
import lock from '../assets/Images/lock.png';
import { ResetMailSchema } from '../utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetMail = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
} = useForm({
    resolver: zodResolver(ResetMailSchema),
    mode: 'onChange',
});

const [errorMessage, setErrorMessage] = useState('');

const onSubmit = async (data) => {
  try {
      const response = await axios({
          method: 'POST',
          url: 'http://127.0.0.1:8000/reset_send_mail/',
          headers: {
              'Content-Type': 'application/json',
          },
          data: {
              email: data.email,
          },
      });
      if (response.status === 200) {
          toast.success("Reset Password Mail Sended Successfully")
         console.log(response.data)
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
        <div className="d-flex justify-content-center align-items-center">
          <img src={logo} alt="Logo" height="50em" style={{ marginBottom: '1vh' }} />
          <h2 className="ms-2 mt-1" style={{ fontSize: '2.2rem', color: '#1e5b85', fontFamily: 'sans-serif'}}>
                  <b><b>Network</b></b>
          </h2>
        </div>
        <img src={lock} alt="Logo" height="80em" style={{ marginBottom: '1vh' }} />
        <p style={{fontSize:'1.1rem'}} className='mb-1'><b>Trouble logging in?</b></p>
        <p className="text-center" style={{ fontSize: '13px' }}>
        If the email you entered is associated with an account, you will receive a password reset link shortly. 
        Please check your inbox and follow the instructions to reset your password.
          </p>
      </div>
  
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
          <input
            type="email"
             name="email"
            {...register('email')}
            className="form-control form-control-sm"
            placeholder="Email Address *"
           
          />
          {errors.email && (
            <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
              {errors.email.message}
            </div>
          )}
          
          {errorMessage && (
          <div className="text-danger mt-1 mb-2" style={{ fontSize: 'small' }}>
              {errorMessage}
          </div> )}
          <button type="submit" className="mt-3 btn-success btn w-100" >
                <b>Send Mail</b>
              </button>
        </div>
        <p className="text-center mt-3">
        Back to <Link to="/login" className="link-hover">Log in</Link>
        </p>
      </form>
    </div>
  </div>
  
  )
}

export default ResetMail