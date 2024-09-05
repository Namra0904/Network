import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import img from '../assets/Images/logo_icon.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from "../utils/schema";
import { Link, useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(LoginSchema),
        mode: 'onChange',
    });
    
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await axios({
                method: 'POST',
                url: 'http://127.0.0.1:8000/login/',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    login: data.emailOrUsername,
                    password: data.password,
                },
            });
            if (response.status === 200) {
                localStorage.setItem('authToken', response.data.token);
                console.log('Login successful:', response.data);
            }
        } catch (error) {
            if(error.response.data.error === 'Unverified'){
                navigate('/verify')
            }
            if (error.response.status === 401) {
                setErrorMessage('Invalid username or password')
            }
            else {
                console.error('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="bg-white rounded p-4 shadow-sm bg-light" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-3">
                    <img src={img} alt="Logo" height="45em" style={{ marginBottom: '2vh' }} />
                    <h3>Log in to Network</h3>
                </div>

                <form method="post" id="signin-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3">
                        <input
                            className="form-control form-control-sm"
                            type="text"
                            name="emailOrUsername"
                            placeholder="Username or Email"
                            autoComplete="off"
                            autoFocus
                            {...register('emailOrUsername')}
                        />
                        {errors.emailOrUsername && (
                            <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                                {errors.emailOrUsername.message}
                            </div>
                        )}
                    </div>
                    <div className="form-group mb-3">
                        <input
                            className="form-control form-control-sm"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="off"
                            {...register('password')}
                        />
                        {errors.password && (
                            <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    
                    {errorMessage && (
                    <div className="text-danger mt-1 mb-2" style={{ fontSize: 'small' }}>
                        {errorMessage}
                    </div>
                    )}
                    <div className="text-center mb-3">
                        <input
                            className="btn btn-success"
                            type="submit"
                            value="Log in"
                            style={{ width: '95%' }}
                        />
                    </div>
                </form>

                <div className="text-center">
                    Don't have an account?&nbsp;
                    <Link to="/signup" className="text-decoration-none">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;