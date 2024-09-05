import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import img from '../assets/Images/logo_icon.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema } from "../utils/schema";

function Register(){
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  
  const onSubmit = async (data) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/register/',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            firstname:data.firstname,
            lastname:data.lastname,
            username:data.username,
            email:data.email,
            password:data.password,
        },
    });
      if (response.status === 201) {
        setErrorMessage('');
        localStorage.setItem('userId', response.data.userId);
        console.log('Success:', response.data);
        navigate('/verify');
      }
    } catch (error) {
      if (error.response.status === 409) {
        setErrorMessage('Email or Username is already registered.');
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-white rounded shadow-sm"
        style={{ maxWidth: '400px', width: '100%',}}
      >
        <div className="d-flex justify-content-center">
          <img src={img} height="45em" style={{ marginBottom: '2vh' }} alt="Logo" />
        </div>

        <h3 className="text-center mb-4">Sign up for Network</h3>

        <div className="mb-3">
          <div className="row">
            <div className="col">
              <input
                type="text"
                name="firstname"
                {...register('firstname')}
                className="form-control form-control-sm"
                placeholder="First Name *"
                
              />
              {errors.firstname && (
                <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                  {errors.firstname.message}
                </div>
              )}
            </div>
            <div className="col">
              <input
                type="text"
                 name="lastname"
                {...register('lastname')}
                className="form-control form-control-sm"
                placeholder="Last Name *"
               
              />
              {errors.lastname && (
                <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                  {errors.lastname.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="username"
            {...register('username')}
            className="form-control form-control-sm"
            placeholder="Username *"
            
          />
          {errors.username && (
            <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
              {errors.username.message}
            </div>
          )}
        </div>

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
        </div>

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
            <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
        {errorMessage && (
          <div className="text-danger mt-1 mb-2" style={{ fontSize: 'small' }}>
            {errorMessage}
          </div>
        )}

        <button type="submit" className="btn btn-success w-100 mt-3"><b>Sign Up</b></button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="link-hover">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;