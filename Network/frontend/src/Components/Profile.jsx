import React from 'react';
import { Dropdown } from 'react-bootstrap';
import '../App.css';

const Profile = () => {
  const handleEditPost = (postId) => {
    console.log(`Editing post ${postId}`);
    // Add logic for editing post
  };

  const handleDeletePost = (postId) => {
    console.log(`Deleting post ${postId}`);
    // Add logic for deleting post
  };

  return (
    <div className="container">
      <div className="profile-header d-flex align-items-center">
        <div className="profile-pic">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded-circle img-fluid"
          />
        </div>
        <div className="profile-info ms-4">
          <div className="d-flex align-items-center">
            <h3 className="profile-username me-3">username123</h3>
            <button className="btn btn-outline-primary">Edit Profile</button>
            {/* Show Follow/Following button conditionally */}
          </div>
          <div className="profile-stats d-flex mt-3">
            <div className="me-4">
              <strong>25</strong> posts
            </div>
            <div className="me-4">
              <strong>200</strong> followers
            </div>
            <div>
              <strong>180</strong> following
            </div>
          </div>
          <div className="profile-bio mt-3">
            <p><strong>Full Name</strong></p>
            <p>This is the user bio. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </div>

      <hr />

      {/* Tabs Section */}
      <ul className="nav nav-tabs justify-content-center mt-3">
        <li className="nav-item">
          <a className="nav-link active" href="#posts">Posts</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#saved">Saved</a>
        </li>
      </ul>

      {/* Post Grid Section */}
      <div className="post-grid row mt-4">
        {[...Array(9)].map((_, index) => (
          <div className="col-4 mb-4" key={index}>
            <div className="post-container position-relative">
              <img
                src={`https://via.placeholder.com/300?text=Post+${index + 1}`}
                alt={`Post ${index + 1}`}
                className="img-fluid post-thumbnail"
              />
              
              {/* Dropdown for each post */}
              <Dropdown className="post-dropdown">
                <Dropdown.Toggle variant="light" className="post-dropdown-toggle">
                  <i className="bi bi-three-dots"></i> {/* Icon for dropdown */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleEditPost(index)}>
                    Edit Post
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeletePost(index)}>
                    Delete Post
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
