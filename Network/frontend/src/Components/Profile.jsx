import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { ImageFill } from 'react-bootstrap-icons';
import axios from 'axios';
import '../App.css';
import img from "../assets/Images/pic_image.png";
import { Heart, MessageCircle, Bookmark, SendHorizontal} from 'lucide-react';
import EditProfile from './EditProfile';

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Profile modal
  const [activeTab, setActiveTab] = useState('posts'); // State for active tab
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  const [selectedFile, setSelectedFile] = useState(null); // For the selected file
  const [previewImage, setPreviewImage] = useState(null); 

  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    dob: '',
    image: '',
    posts: [],  // User posts
    // saved: []   // Saved posts
  });

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
          // saved: data.saved || []    
        });
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, [authToken]); 

  // const handleDeletePost = (postId) => {
  //   console.log(`Deleting post ${postId}`);
  // };

  const handlePostClick = (post) => {
    setSelectedPost(post.image); 
    setShowModal(true); 
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfileUpdate = () => {
    console.log('Updated profile data:', profileData);
    setShowEditModal(false); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);  
      setPreviewImage(imageUrl); 
      setSelectedFile(file);  
    }
  };

  const renderPostGrid = (type) => {
    const posts = type === 'posts' ? profileData.posts : profileData.saved;
    
    if (!posts.length) {  
      return <p>No {type} available.</p>;
    }

    return (
      <div className="post-grid-scrollable mt-2">
        <div className="row">
          {posts.map((post, index) => (
            <div className="col-6 col-md-4 mb-4" key={post.postId}>
              <div className="post-item">
                <img
                  src={`http://127.0.0.1:8000/${post.image}`}
                  alt={`Post ${index + 1}`}
                  className="img-fluid "
                  onClick={() => handlePostClick(post)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          ))}
        </div>
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
            Posts
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        </li>
      </ul>


      {activeTab === 'posts' ? renderPostGrid('posts') : renderPostGrid('saved')}

      <Modal show={showModal} onHide={handleClose} centered keyboard={false} animation={true}>
      <Modal.Body className="text-center">
        {selectedPost ? (
          <div
            key={selectedPost.index} 
            className="card mb-3"
            style={{
              maxWidth: '500px',
              borderRadius: '0px',
              border: '1px solid #dbdbdb',
              margin: '0 auto',
            }}
          >
            <div className="card-body p-2">
              <div className="d-flex align-items-center mb-2">
                <div>
                  <img
                    src={selectedPost.profileImage || img}
                    alt="profile"
                    style={{
                      width: '53px',
                      height: '45px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div>
                  <h6 className="mb-0" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{selectedPost.userName}</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
                    @{selectedPost.username} · {selectedPost.time} {selectedPost.date}
                  </p>
                </div>
              </div>

              <div>
                <img
                  src={`http://127.0.0.1:8000/${selectedPost.image}`}
                  className="img-fluid rounded mb-2"
                  alt="Post"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>

              <div className="d-flex justify-content-between mb-2 px-2">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center mr-2">
                    <Heart
                      style={{ cursor: 'pointer', color: selectedPost.liked ? 'red' : 'black' }}
                      onClick={() => handleLike(selectedPost.postId, selectedPost.index)}
                      fill={selectedPost.liked ? 'red' : 'white'}
                    />
                    {selectedPost.likes > 0 && <span style={{ fontSize: '0.8rem' }}>{selectedPost.likes}</span>}
                  </div>
                  <div className="d-flex align-items-center" onClick={() => toggleComments(selectedPost.index)} style={{ cursor: 'pointer' }}>
                    <MessageCircle className="ms-1" style={{ cursor: 'pointer' }} />
                    {Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0 && (
                      <span style={{ fontSize: '0.8rem' }}>{selectedPost.comments.length}</span>
                    )}
                  </div>
                </div>
                <div>
                  <Bookmark
                    style={{ cursor: 'pointer', color: selectedPost.saved ? 'black' : 'black' }}
                    onClick={() => handleSaved(selectedPost.postId, selectedPost.index)}
                    fill={selectedPost.saved ? 'black' : 'white'}
                  />
                </div>
              </div>

              <p className="mb-2" style={{ fontSize: '0.9rem', marginLeft: '4px' }}>
                {selectedPost.content || 'No content available'}  
              </p>

              {selectedPost.showComments && (
                <div className="mt-2">
                  <div className="text-center" style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                    {Array.isArray(selectedPost.comments) && selectedPost.comments.length === 0 ? (
                      <b>No comments</b>
                    ) : (
                      <b>Comments</b>
                    )}
                  </div>

                  {Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0 &&
                    selectedPost.comments.map((comment, idx) => (
                      <div key={idx}>
                        <div className="mt-2 d-flex align-items-center">
                          <img
                            src={comment.profileImage || img} 
                            alt="profile"
                            style={{
                              width: '53px',
                              height: '45px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                          <strong style={{ fontSize: '0.85rem', display: 'block' }}>{comment.username}</strong>
                        </div>
                      
                        <div className="ms-5">
                          <p
                            className="mb-0"
                            style={{
                              backgroundColor: '#F1F1F1',
                              padding: '8px 12px',
                              borderRadius: '12px',
                              fontSize: '0.85rem',
                              marginTop: '-10px',
                            }}
                          >
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}

                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control mt-3"
                      placeholder="Write a comment..."
                      value={commentInputs[selectedPost.postId] || ''} 
                      onChange={(e) => handleCommentChange(e, selectedPost.postId)}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.35rem',
                        paddingRight: '2.5rem', 
                        borderRadius: '15px',
                        borderColor: '#dbdbdb',
                      }}
                    />
                    <SendHorizontal
                      style={{
                        position: 'absolute',
                        right: '20px',
                        cursor: 'pointer',
                        color: '#888',
                        marginTop: '-25px',
                      }}
                      size={20}
                      onClick={() => handleCommentSubmit(selectedPost.postId, selectedPost.index)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No post selected</p>
        )}
      </Modal.Body>
    </Modal>

      <EditProfile showEditModal={showEditModal} setShowEditModal={setShowEditModal} profileData={profileData} />
    </div>
  );
};

export default Profile;