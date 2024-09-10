import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img from '../assets/Images/logo_icon.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerifySchema } from '../utils/schema';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(VerifySchema),
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/user/verify/',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          otp: data.otp,
          id: userId,
        },
      });
      
      if (response.status === 201) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/home/post')
        // setMessage('OTP verified successfully! You are now authenticated.');
      }
    } catch (error) {
      if (error.response.status === 500) console.log(error.response.data);
      setMessage('Invalid OTP or OTP has expired. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/user/resend_mail/',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: userId,
        },
      });

      if (response.status === 201){
        setMessage('OTP resent successfully. Please check your email.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className=" d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-100">
        <div className="col-lg-4 col-md-6 col-sm-8 col-12 mx-auto">
          <div className="card shadow-sm p-4">
            <div className="text-center mb-2">
              <div className="d-flex justify-content-center">
                <img src={img} height="45em" style={{ marginBottom: '2vh' }} alt="Logo" />
              </div>
              <h3>OTP Verification</h3>
              <p className="text-center" style={{ fontSize: '13px' }}>
                An OTP has been sent to your registered email address. Please enter the OTP below to verify your account.
                <br />
                Ensure that you enter the correct OTP within the next 3 minutes, as it will expire afterward.
                <br />
                If you didn’t receive the OTP, click on the "Resend OTP" button to receive a new code.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  {...register('otp')}
                />
                {errors.otp && (
                  <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                    {errors.otp.message}
                  </div>
                )}
              </div>
              {message && <div className="text-danger mt-3 mb-3">{message}</div>}
              <button type="submit" className="btn btn-success w-100">
                Verify
              </button>
              <button
                type="button"
                className="btn btn-danger w-100 mt-3"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;