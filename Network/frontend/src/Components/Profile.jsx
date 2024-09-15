import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import img from "../assets/Images/pic_image.png";
import EditProfile from './EditProfile';
import SelectedPost from './SelectedPost';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); 
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  const [deleteModel,setDeleteModel] = useState(false)
  const data = useParams()

  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    dob: '',
    image: '',
    posts: [],  
    saved: [],
    followers:0,
    following:0,
    isUser:false
  });

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/user/profile/${data.username}/`,
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
          saved: data.saved || [],
          followers:data.followers,
          following:data.following,
          isUser:data.is_user,
          isFollower:data.is_following
        },
      );
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, [authToken]); 

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

  const savedUnsaved = async(postId,index) =>{
    try {
      const post = profileData.posts[index];
      const updatedPosts = [...profileData.posts];
        if (!selectedPost.saved_by_user) {
          await axios.put(`http://127.0.0.1:8000/user/post/${postId}/save`, {}, {
            headers: { Authorization: authToken },
          });
          selectedPost.saved_by_user = true
        } else {
          await axios.put(`http://127.0.0.1:8000/user/post/${postId}/unsave`, {}, {
            headers: { Authorization: authToken },
          });
          selectedPost.saved_by_user = false
        }
        updatedPosts[index] = {
          ...post,
          saved_by_user:selectedPost.saved_by_user, 
        };
        setProfileData(prevState => ({
          ...prevState,
          posts: updatedPosts,
        }));
      } catch (error) {
        console.error('Error saving/unsaving post:', error);
      }
  }  

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/user/post/${postId}/delete/`, {
        headers: { Authorization: authToken },
      });
      const updatedPosts = profileData.posts.filter((post) => post.postId !== postId);
      const updatedSaved = profileData.saved.filter((savedPost) => savedPost.postId !== postId);
      setProfileData(prevState => ({
        ...prevState,
        posts: updatedPosts,
        saved: updatedSaved, 
      }));
      setDeleteModel(false); 
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/follow/${profileData.username}/`, {}, {
        headers: { Authorization: `${authToken}` }
      });
      setProfileData(prevState => ({
        ...prevState,
        isFollower: true
      }));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/unfollow/${profileData.username}/`, {}, {
        headers: { Authorization: `${authToken}` }
      });
      setProfileData(prevState => ({
        ...prevState,
        isFollower: false
      }));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
 

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
      {profileData.isUser ? (
              <button className="btn btn-outline-primary btn-sm ms-3" onClick={handleEditProfile}>
                Edit Profile
              </button>
            ) : profileData.isFollower ? (
              <button className="btn btn-primary btn-sm ms-3" onClick={handleUnfollow}>
                Unfollow
              </button>
            ) : (
              <button className="btn btn-outline-primary btn-sm ms-3" onClick={handleFollow}>
                Follow
              </button>
            )}
       
    </div>
    <div className="d-flex mb-2 mt-4 justify-content-start">
      <div className="me-4 text-center">
        <strong>{profileData.posts.length}</strong> posts
      </div>
      <div className="me-4 text-center">
        <strong>{profileData.followers}</strong> followers
      </div>
      <div className='me-4 text-center'>
        <strong>{profileData.following}</strong> following
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
        {profileData.isUser && (
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <b>Saved</b>
        </button>
      </li>
    )}
      </ul>


    {activeTab === 'posts' ? renderPostGrid('posts') : renderPostGrid('saved')}

    <SelectedPost showModal={showModal} selectedPost={selectedPost} setShowModal={setShowModal} 
    authToken={authToken} likeUnlike={likeUnlike} savedUnsaved={savedUnsaved} handleDeletePost={handleDeletePost} setDeleteModel={setDeleteModel}
    deleteModel={deleteModel}/>
    <EditProfile showEditModal={showEditModal} setShowEditModal={setShowEditModal} profileData={profileData} />
    </div>
  );
};

export default Profile;