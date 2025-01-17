import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import '../App.css';
import BottomBar from './BottomBar';
import { Link } from 'react-router-dom';
import img from "../assets/Images/pic_image.png";


const RightSidebar = ({ isVisible, toggleSidebar }) => {
  const [users, setUsers] = useState([]);
  const [visibleUsersCount, setVisibleUsersCount] = useState(5);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/search/', {
          search: searchQuery
        }, {
          headers: { Authorization: `${authToken}` }
        });
        if (response.data.users && response.data.users.length > 0) {
          setUsers(response.data.users);
        } else {
          setUsers([]); // No users found, set to empty array
        }
        console.log(response.data.users);
       
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  const handleFollow = async (username) => {
    try {
      await axios.put(`http://127.0.0.1:8000/follow/${username}/`, {}, {
        headers: { Authorization: `${authToken}` }
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.username === username ? { ...user, isFollowed: true } : user
        )
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      await axios.put(`http://127.0.0.1:8000/unfollow/${username}/`, {}, {
        headers: { Authorization: `${authToken}` }
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.username === username ? { ...user, isFollowed: false } : user
        )
      );
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handlereload =()=>
  {
    setTimeout(()=>{
      location.reload();
    },1);
  }

  const handleFollowToggle = (username, isFollowed) => {
    if (isFollowed) {
      handleUnfollow(username);
    } else {
      handleFollow(username);
    }
  };

  const handleShowMoreLessToggle = () => {
    if (showAllUsers) {
      setVisibleUsersCount(5); // Show only initial 3 users
    } else {
      setVisibleUsersCount(users.length); // Show all users
    }
    setShowAllUsers(!showAllUsers);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const showShowMoreButton = users.length >= 5;

  return (
    <>
      <aside
        className={`col-lg-3 right-sidebar d-none d-lg-block position-fixed`}
        style={{
          right: 0,
          top: 0,
          height: '100vh',
          borderLeft: ".5px solid #e6ecf0",
        }}
      >
        {/* Search Bar - Visible on larger screens */}
        <div className="d-none d-lg-block">
          <div className="search-bar mb-3 ms-2 me-2" style={{ marginTop: '-38px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search username"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <span className="input-group-text">
                <FaSearch />
              </span>
            </div>
          </div>
          <div style={{ fontSize: '16px' }} className='mb-1 ms-2 '><b>You might know</b></div>
        </div>

        <div className="user-list-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="user-list p-2">
            {/* Check if there are users, otherwise show "No results found" */}
            {users.length > 0 ? (
              <>
                {users.slice(0, visibleUsersCount).map((user) => (
                  <div
                    key={user.id}
                    className="user-item d-flex align-items-center mb-1 p-2"
                  >  
                    <img
                      src={user.image ? `http://127.0.0.1:8000/${user.image}` : img} 
                      alt={user.name}
                      className="rounded-circle me-3"
                      style={{ width: '40px', height: '40px' }} 
                    />
                    <Link to={`/home/profile/${user.username}`} onClick={handlereload} className="user-info flex-grow-1">
                      <p className="mb-0 text-dark" style={{ fontSize: '13px' }}>
                        <b>{user.firstname} {user.lastname}</b>
                      </p>
                      <small className="text-muted" style={{ fontSize: '12px' }}>
                        @{user.username}
                      </small>
                    </Link>
                    <button
                      className={`btn btn-sm ${user.isFollowed ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleFollowToggle(user.username, user.isFollowed)}
                    >
                      {user.isFollowed ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                ))}
                {showShowMoreButton && (
                  <div className="mt-1">
                    <button
                      className="btn btn-link link-hover"
                      onClick={handleShowMoreLessToggle}
                      style={{ fontSize: '14px' }}
                    >
                      {showAllUsers ? 'Show Less' : 'Show More'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center mt-4">
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <BottomBar />
    </>
  );
};

export default RightSidebar;
