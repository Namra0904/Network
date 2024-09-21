import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation
import '../App.css';
import BottomBar from './BottomBar';



const Search = ({ isVisible, toggleSidebar }) => {
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
