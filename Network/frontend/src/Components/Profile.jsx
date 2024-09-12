import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
// import { ImageFill } from 'react-bootstrap-icons';
import axios from 'axios';
import '../App.css';
import img from "../assets/Images/pic_image.png";
import EditProfile from './EditProfile';
import SelectedPost from './SelectedPost';
import { Link } from 'react-router-dom';


const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Profile modal
  const [activeTab, setActiveTab] = useState('posts'); // State for active tab
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  // const [commentInputs, setCommentInputs] = useState({}); 
  // const [post_, setPosts] = useState(profileData.posts);


  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    dob: '',
    image: '',
    posts: [],  
    saved: [],
  });

  const likeUnlike = async (postId,index) => {
    try {
      const post = profileData.posts[index];
      const updatedPosts = [...profileData.posts];
      if (!selectedPost.liked_by_user) {
        await axios.put(`http://127.0.0.1:8000/user/post/${postId}/like`, {}, {
          headers: { Authorization: authToken },
        });
        selectedPost.liked_by_user = true;
        selectedPost.likes += 1;
      } else {
        await axios.put(`http://127.0.0.1:8000/user/post/${postId}/unlike`, {}, {
          headers: { Authorization: authToken },
        });
        selectedPost.liked_by_user = false;
        selectedPost.likes -= 1;
      }
      updatedPosts[index] = {
        ...post,
        liked_by_user:selectedPost.liked_by_user, 
        likes: selectedPost.likes
      };
      setProfileData(prevState => ({
        ...prevState,
        posts: updatedPosts,
      }));
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };
  

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/user/profile',
     { headers: { Authorization: authToken }}) 
      .then(response => {
        const data = response.data;
       
        setProfileData({
          username: data.username,
          Name: data.name, 
          firstName:data.firstname,
          lastName: data.lastname,
          bio: data.bio,
          dob: data.dob,
          image: data.profileImage,
          posts: data.posts || [],   
          saved: data.saved || []    
        },
      );
      // setPosts(initializedPosts);
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, [authToken]); 

  const handlePostClick = (post,index) => {
    setSelectedPost({ ...post, index });
    setShowModal(true); 
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const renderPostGrid = (type) => {
    const posts = type === 'posts' ? profileData.posts : profileData.saved;
    
    if (!posts.length) {  
      return <p>No {type} available.</p>;
    }
    const visiblePosts = type === 'saved' ? posts.slice(0, 6) : posts;

    return (
      <div className="post-grid-scrollable mt-2">
        <div className="row">
          {visiblePosts.map((post, index) => (
            <div className="col-6 col-md-4 mb-4" key={post.postId}>
              <div className="post-item">
                <img
                  src={`http://127.0.0.1:8000/${post.image}`}
                  alt={`Post ${index + 1}`}
                  className="img-fluid "
                  onClick={() => handlePostClick(post,index)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          ))}
        </div>
        {type === 'saved' && posts.length > 6 && (
        <div className="text-center">
          <Link to="/home/saved" className="link-hover">See More Saved Posts</Link>

        </div>
      )}
      </div>
    );
  };

  return (
    <div className="container mg">  
     <div className="row align-items-center post">
  <div className="col-4 col-md-4 text-center">
    <img
      src={profileData.image ? 'http://127.0.0.1:8000/'+profileData.image : img}
      alt="Profile"
      className="rounded-circle img-fluid profile-image"
    />
  </div>
  <div className="col-8 col-md-8">
    <div className="d-flex align-items-center mb-2">
      <h3 className="me-3">{profileData.username}</h3>
      <button className="btn btn-outline-primary btn-sm ms-3" onClick={handleEditProfile}>
        Edit Profile
      </button>
    </div>
    <div className="d-flex mb-2 mt-4 justify-content-start">
      <div className="me-4 text-center">
        <strong>{profileData.posts.length}</strong> posts
      </div>
      <div className="me-4 text-center">
        <strong>200</strong> followers
      </div>
      <div className='me-4 text-center'>
        <strong>180</strong> following
      </div>
    </div>
  </div>
  <div className="col-12 mt-3">
    <p className="mb-0"><strong>{`${profileData.Name}`}</strong></p>
    <p>{profileData.bio}</p>
  </div>
</div>

      <hr />

      <ul className="nav nav-tabs justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
          <b>Posts</b>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
          <b>Saved</b>
          </button>
        </li>
      </ul>


    {activeTab === 'posts' ? renderPostGrid('posts') : renderPostGrid('saved')}

    <SelectedPost showModal={showModal} selectedPost={selectedPost} setShowModal={setShowModal} 
    authToken={authToken} likeUnlike={likeUnlike}/>
    <EditProfile showEditModal={showEditModal} setShowEditModal={setShowEditModal} profileData={profileData} />
    </div>
  );
};

export default Profile;