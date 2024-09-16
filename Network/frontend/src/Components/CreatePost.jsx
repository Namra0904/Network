import React, { useState, useEffect } from 'react';
import { Modal, Button, CloseButton } from 'react-bootstrap';
import { ImageFill } from 'react-bootstrap-icons';
import axios from 'axios'; 
import toast from 'react-hot-toast';


const CreatePostModal = ({ showModal, handleCloseModal }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
  }, []);

  const handlePost = async () => {
    if (!selectedFile) {
      alert('Please select an image to post.');
      return;
    }
    console.log(authToken)
    const formData = new FormData();
    formData.append('image', selectedFile); // Append the file
    formData.append('text', caption); // Append the caption

    try {
      const response = await axios.post('http://127.0.0.1:8000/user/createpost/', formData,{
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        handleCloseModal(); 
        toast.success("Posted Successfully Created")
      }
    } catch (error) {
      console.error('There was an error creating the post:', error);

    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <Modal
      show={showModal}
      centered
      onHide={handleCloseModal}
      size='md'
    >
      <Modal.Body>
        <div className="mt-0">
          <Button variant="" className="text-success" as="label">
            <ImageFill className="me-2" /> Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Button>
        </div>
        {selectedFile && (
          <div className="mt-2 position-relative">
            <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ height:"200px", width:"100%", objectFit:"contain"}} />
            <CloseButton
              onClick={handleRemoveFile}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                backgroundColor: 'white',
              }}
            />
          </div>
        )}
        <textarea
          className="form-control mt-2"
          placeholder="Add your caption"
          rows="4"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
      </Modal.Body>
      <Modal.Footer style={{ border: 'none' }}>
        <Button variant="danger" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="success" onClick={handlePost}>Post</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePostModal;