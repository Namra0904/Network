import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation
import '../App.css';
import BottomBar from './BottomBar';

const initialUsers = [
  { id: 1, name: 'John Doe', username: '@johndoe', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 2, name: 'Jane Smith', username: '@janesmith', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 3, name: 'Mike Johnson', username: '@mikejohnson', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 4, name: 'Emily Davis', username: '@emilydavis', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 5, name: 'David Wilson', username: '@davidwilson', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 6, name: 'Sarah Brown', username: '@sarahbrown', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 7, name: 'Chris Lee', username: '@chrislee', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 8, name: 'Laura Green', username: '@lauragreen', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 9, name: 'Laura Green', username: '@lauragreen', img: 'https://via.placeholder.com/40', isFollowed: false },
  { id: 10, name: 'Laura Green', username: '@lauragreen', img: 'https://via.placeholder.com/40', isFollowed: false },
  
  // Add more users as needed
];

const Search = ({ isVisible, toggleSidebar }) => {
  const [users, setUsers] = useState(initialUsers);
  const [visibleUsersCount, setVisibleUsersCount] = useState(3);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 552) {
        navigate('/home/post'); // Navigate to /home/post when window width is greater than 552px
      } else {
        navigate('/home/search'); // Navigate back to /home/search when window width is less than or equal to 552px
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [history]);

  const handleFollowToggle = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isFollowed: !user.isFollowed } : user
      )
    );
  };

  const handleShowMoreLessToggle = () => {
    if (showAllUsers) {
      setVisibleUsersCount(3); // Show only initial 3 users
    } else {
      setVisibleUsersCount(users.length); // Show all users
    }
    setShowAllUsers(!showAllUsers);
  };

  return (
    <>
      <aside
        className={`col-lg-3 d-lg-block `}
        style={{
          right: 0,
          top: 0,
          height: '100vh',
          borderLeft: ".5px solid #e6ecf0",
        }}
      >
        {/* Scrollable user list container */}
        <div className="user-list-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="user-list p-2">
            {users.slice(0, visibleUsersCount).map((user) => (
              <div
                key={user.id}
                className="user-item d-flex align-items-center mb-1 p-2"
              >
                <img
                  src={user.img}
                  alt={user.name}
                  className="rounded-circle me-3"
                  style={{ width: '35px', height: '35px' }} // Adjusted size
                />
                <div className="user-info flex-grow-1">
                  <p className="mb-0" style={{ fontSize: '14px' }}>
                    <b>{user.name}</b>
                  </p>
                  <small className="text-muted" style={{ fontSize: '12px' }}>
                    {user.username}
                  </small>
                </div>
                <button
                  className={`btn btn-sm ${user.isFollowed ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleFollowToggle(user.id)}
                >
                  {user.isFollowed ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))}
            <div className="mt-1">
              <button
                className="btn btn-link link-hover"
                onClick={handleShowMoreLessToggle}
                style={{fontSize:"14px"}}
              >
                {showAllUsers ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Search;
