import React, { useState, useEffect } from 'react';
import {
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaBookmark
} from 'react-icons/fa';
import Main from './Main';
import { Link, useLocation  } from 'react-router-dom';
import BottomBar from './BottomBar';
import CreatePostModal from './CreatePost';
import img from '../assets/Images/logo_icon.png';
import RightSidebar from './RightSide';
import TopBar from './TopBar';
import '../App.css';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';


const Sidebar = () => {
  
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');


    // <Toaster
    //     position="bottom-right"
    //     reverseOrder={true}
    //     toastOptions={{ duration: 3000 }}
    //     containerStyle={{ zIndex: 99 }}
    //   />

    const handleLogout = async() =>{
      try{
        const response = await axios.post('http://127.0.0.1:8000/logout/',{},
          {
            headers: { Authorization: authToken }
          })
          console.log(response)
         if(response.status === 200){
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId')
          console.log(response.message)
         }
      }catch(error){
          console.log(error.response)
      }
    }

    const handleShowModal = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

  const isActive = (path) =>  location.pathname === path

  return (
    <div className="row">
      <nav className={`col-lg-3 col-md-4 sidebar d-none d-lg-flex flex-column vh-100 position-fixed`}
         style={{  borderRight: ".5px solid #e6ecf0" }}
      >
        <div className="p-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src={img}
                height="40px"
                width="100%"
                className="ms-3"
                alt="logo"
              />
              <h2 className="ms-2 mt-1" style={{ fontSize: '2rem', color: '#1e5b85', fontFamily: 'sans-serif' }}>
                  <b><b>Network</b></b>
                </h2>
            </div>
          </div>
        </div>
        <ul className="nav flex-column p-1">
      <li className="nav-item mb-3 ms-4">
        <Link
          to="/home/post"
          className={`nav-link text-dark d-flex align-items-center ${isActive('/home/post') ? 'active' : ''}`}
        >
          <FaHome className="me-2" size={22} />
           <span className="ms-1" style={{ fontSize: '17px' }}><b>All Posts</b></span>
        </Link>
      </li>
      <li className="nav-item mb-3 ms-4">
        <Link
          to="/home/saved"
          className={`nav-link text-dark d-flex align-items-center ${location.pathname === '/home/saved' ? 'active' : ''}`}
        >
          <FaBookmark className="me-2" size={22} />
         <span className="ms-1" style={{ fontSize: '17px' }}><b>Saved</b></span>
        </Link>
      </li>
      <li className="nav-item mb-3 ms-4">
        <Link
          to="/home/chats"
          className={`nav-link text-dark d-flex align-items-center ${location.pathname === '/home/chats' ? 'active' : ''}`}
        >
          <FaUsers className="me-2" size={22} />
         <span className="ms-1" style={{ fontSize: '17px' }}><b>Chats</b></span>
        </Link>
      </li>
      <li className="nav-item mt-auto ms-4 mb-3">
        <Link
          to="/login"
          className={`nav-link text-dark d-flex align-items-center ${location.pathname === '/home/logout' ? 'active' : ''}`}
        onClick={handleLogout}>
          <FaSignOutAlt className="me-2" size={22} />
          <span className="ms-1" style={{ fontSize: '17px' }}><b>Logout</b></span>
        </Link>
      </li>
      <button 
        className="btn rounded-pill create-post-btn ms-4" 
        style={{ fontSize: "17px", backgroundColor: '#28A745', color: 'white' }} 
        onClick={handleShowModal}
      >
        <b>Create Post</b>
      </button>
    </ul>

        <div className="p-3 mt-auto d-flex align-items-center profile-card">
          <div className="avatar bg-primary text-white rounded-circle me-2" >
            JD
          </div>
         
            <Link to="/home/profile" style={{ textDecoration: 'none' }}>
              <p className="mb-0 text-dark">
                <b style={{ fontSize: '15px' }}>John Doe</b>
              </p>
              <small className='text-dark' style={{ fontSize: '12px' }}>johndoe@gmail.com</small>
            </Link>
         
        </div>
      </nav>

      <Main />
      <TopBar  />
      <RightSidebar/>
      <BottomBar />
      <CreatePostModal showModal={showModal} handleCloseModal={handleCloseModal}/>
    </div>
  );
};

export default Sidebar;