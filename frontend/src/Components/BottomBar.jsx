import React from 'react';
import { useState } from 'react';
import { FaHome, FaPlus, FaUser, FaUsers, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from './CreatePost';
import Main from './Main';

const BottomBar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);


  const handleNavigation = (path) => {
    // if (isRightSidebarVisible) {
    //     toggleRightSidebar(); 
    //   }
    navigate(path);
  };


  const model = ()=>{
     setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);  
  };

  const isActive = (path) => location.pathname === path;


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
      <button 
        className={`nav-link text-dark d-flex flex-column align-items-center mt-2 ${
          isActive("/home/search") ? 'active' : ''
        }`} 
          
        onClick={() => {
        //  toggleRightSidebar(); // Toggle the sidebar visibility
         navigate("/home/search"); // Navigate to the search page
       
        }}>
        <FaSearch size={28} />
        <small>Search</small>
      </button>
      <button 
        className="nav-link text-dark d-flex flex-column align-items-center mt-2" 
        onClick={() => model()}>
        <FaPlus size={28} />
        <small>Create</small>
      </button>
     
      <button 
        className={`nav-link text-dark d-flex flex-column align-items-center mt-2 ${
          isActive('/home/chats') ? 'active' : ''
        }`} 
        onClick={() => handleNavigation("/home/chats")}>
        <FaUsers size={28} />
        <small>Chats</small>
      </button>
      
      <button 
        className={`nav-link text-dark d-flex flex-column align-items-center mt-2
          ${
            isActive('/home/profile') ? 'active' : ''
          }`}
        onClick={() => handleNavigation("/home/profile")}>
        <FaUser size={28} />
        <small>Profile</small>
      </button>
      <CreatePostModal showModal={showModal} handleCloseModal={handleCloseModal} />
      
    </div>
    
  );
};

export default BottomBar;