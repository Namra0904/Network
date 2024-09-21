import React from 'react';
import { useState,useEffect } from 'react';
import { FaHome, FaPlus, FaUser, FaUsers, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from './CreatePost';
import Main from './Main';
import axios from 'axios';

const BottomBar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userData,setUserData] = useState({
    username: "",
  })
  const [authToken,setAuthToken]=useState(()=>localStorage.getItem("authToken"))

  const handleNavigation = (path) => {
    navigate(path);
  };


  const model = ()=>{
     setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);  
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/user/`,
     { headers: { Authorization: authToken }}) 
      .then(response => {
        const data = response.data;
        setUserData({
          username:data.username
      })
      
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [authToken]); 



  return (
    <div className="d-flex d-lg-none bg-light fixed-bottom justify-content-around p-2" style={{ height: "68px", zIndex: 1050 }}>
      <button 
        className={`nav-link text-dark d-flex flex-column align-items-center mt-2 ${
          isActive('/home/post') ? 'active' : ''
        }`} 
        onClick={() => handleNavigation("/home/post")}>
        <FaHome size={28} />
        <small>Posts</small>
      </button>
      {/* <button 
        className={`nav-link text-dark d-flex flex-column align-items-center mt-2 ${
          isActive("/home/search") ? 'active' : ''
        }`} 
          
        onClick={() => {
        //  toggleRightSidebar(); // Toggle the sidebar visibility
         navigate("/home/search"); // Navigate to the search page
       
        }}>
        <FaSearch size={28} />
        <small>Search</small>
      </button> */}
      <button 
        className="nav-link text-dark d-flex flex-column align-items-center mt-2" 
        onClick={() => model()}>
        <FaPlus size={28} />
        <small>Create</small>
      </button>
     
      {/* <button 
        className={`nav-link text-dark d-flex flex-column align-items-center mt-2 ${
          isActive('/home/chats') ? 'active' : ''
        }`} 
        onClick={() => handleNavigation("/home/chats")}>
        <FaUsers size={28} />
        <small>Chats</small>
      </button> */}
      
      <button 
        className={`nav-link text-dark d-flex flex-column align-items-center mt-2
          ${
            isActive(`/home/profile/${userData.username}`) ? 'active' : ''
          }`}
        onClick={() => handleNavigation(`/home/profile/${userData.username}`)}>
        <FaUser size={28} />
        <small>Profile</small>
      </button>
      <CreatePostModal showModal={showModal} handleCloseModal={handleCloseModal} />
      
    </div>
    
  );
};

export default BottomBar;