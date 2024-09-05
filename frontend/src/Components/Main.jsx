import React from 'react'
import { useState,useEffect } from 'react';
import { Outlet } from 'react-router-dom';
const Main = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 992);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 992);
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  return (
   <>
    <main
        className={`col-lg-6 col-md-8 margin-top-responsive ${isLargeScreen ? 'offset-lg-3 offset-md-4' : ''}`}
        style={{  }}
      >
      
        <Outlet />
      </main>
   </>
  )
}

export default Main
