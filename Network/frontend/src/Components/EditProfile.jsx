import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import img from "../assets/Images/pic_image.png";
import { EditProfileSchema } from '../utils/schema';

const EditProfile = ({ showEditModal, setShowEditModal, profileData }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(EditProfileSchema),
        mode: 'onChange',
    });
    


    useEffect(() => {
        if (profileData) {
            setValue('username', profileData.username);
            setValue('firstName', profileData.firstName);
            setValue('lastName', profileData.lastName);
            setValue('bio', profileData.bio|| "");
            setValue('dob',profileData.dob || "");
            
        }
    }, [profileData, setValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setSelectedFile(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log(data.lastName)
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('firstname', data.firstName);
            formData.append('lastname', data.lastName);
            formData.append('bio', data.bio||'');
            formData.append('dob', data.dob||'');
            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            // console.log(formData)

            data.image = selectedFile
            console.log(data)
            
            const response = await axios.post('http://127.0.0.1:8000/user/update/', formData, {
                headers: {
                    Authorization: authToken,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Profile updated successfully:', response.data);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered dialogClassName="custom-modal-size">
                <Modal.Header closeButton>
                    <Modal.Title><b>Edit Profile</b></Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body className="custom-modal-body">
                        <div className="text-center mb-4">
                            <img
                               src={
                                previewImage ||
                                (profileData.image ? `http://127.0.0.1:8000/${profileData.image}` : img)
                            }
                                alt="Profile"
                                className="rounded-circle"
                                style={{ width: '150px', height: '150px', objectFit: 'cover', }}
                            />
                            <div className="mt-2">
                                <label className="btn btn-link text-success">
                                    Change Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <div className="col-md-4">
                                <label className="form-label"><b>Username:</b></label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register('username')}
                                />
                                {errors.username && (
                                    <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                                        {errors.username.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <div className="col-md-4">
                                <label className="form-label"><b>First Name:</b></label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register('firstName')}
                                />
                                {errors.firstName && (
                                    <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                                        {errors.firstName.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <div className="col-md-4">
                                <label className="form-label"><b>Last Name:</b></label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register('lastName')}
                                />
                                {errors.lastName && (
                                    <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                                        {errors.lastName.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <div className="col-md-4">
                                <label className="form-label"><b>Bio:</b></label>
                            </div>
                            <div className="col-md-8">
                                <textarea
                                    rows="3"
                                    className="form-control"
                                    {...register('bio')}
                                />
                                {errors.bio && (
                                    <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                                        {errors.bio.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <div className="col-md-4">
                                <label className="form-label"><b>Date of Birth:</b></label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    type="date"
                                    className="form-control"
                                    {...register('dob')}
                                />
                                {errors.dob && (
                                    <div className="text-danger mt-1" style={{ fontSize: 'small' }}>
                                        {errors.dob.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Close
                        </Button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}

export default EditProfile;