import React from 'react'
import {
    FaSignOutAlt,
    FaSearch,
  } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import img from '../assets/Images/logo_icon.png';

const TopBar = () => {
    const location = useLocation();
    
    const isSearchPage = location.pathname === '/home/search'; 
  return (
      <>
      <nav className="navbar navbar-light bg-light d-lg-none fixed-top">
  <div className="container-fluid d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center">
      {!isSearchPage && (
        <>
          <img
            src={img}
            height="40px"
            width="40px"
            className="ms-2"
            alt="logo"
          />
          <h2 className="ms-2 mb-0" style={{ color: '#1e5b85', fontFamily: 'sans-serif' }}>
            <b><b>Network</b></b>
          </h2>
        </>
      )}
    </div>
    {isSearchPage ? (
      <div className='w-100 d-flex'>
        <div className="input-group flex-grow-1">
          <input
            type="text"
            className="form-control"
            placeholder="Search username"
            aria-label="Search username"
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>
    ) : (
      <FaSignOutAlt
        size={28}
        className="nav-link text-dark"
      />
    )}
  </div>
</nav>
</>
  )
}

export default TopBar