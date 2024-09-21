import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Bookmark, SendHorizontal} from 'lucide-react';
import axios from 'axios';
import img from "../assets/Images/pic_image.png";



const Post = () => {
  const [posts, setPosts] = useState([]);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  const [commentInputs, setCommentInputs] = useState({}); 
  
  const handleLike = async (postId, index) => {
    const updatedPosts = [...posts];
    try {
      if (!updatedPosts[index].liked) {
        await axios.put(`http://127.0.0.1:8000/user/post/${postId}/like`, {}, {
          headers: { Authorization: authToken }
        });
        updatedPosts[index].liked = true;
        updatedPosts[index].likes += 1;
      } else {
        await axios.put(`http://127.0.0.1:8000/user/post/${postId}/unlike`, {}, {
          headers: { Authorization: authToken }
        });
        updatedPosts[index].liked = false;
        updatedPosts[index].likes -= 1;
      }
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleSaved = async (postId, index) => {
    const updatedPosts = [...posts];
    try {
      if (!updatedPosts[index].saved) {
        await axios.put(`http://127.0.0.1:8000/user/post/${postId}/save`, {}, {
          headers: { Authorization: authToken },
        });
        updatedPosts[index].saved = true;
      } else {
        await axios.put(`http://127.0.0.1:8000/user/post/${postId}/unsave`, {}, {
          headers: { Authorization: authToken },
        });
        updatedPosts[index].saved = false;
      }
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
    }
  };

  const handleCommentChange = (e, postId) => {
    setCommentInputs({ ...commentInputs, [postId]: e.target.value });
  };

  const handleCommentSubmit = async (postId, index) => {
    const commentText = commentInputs[postId];

    if (!commentText) {
      return;
    }
    const updatedPosts = [...posts];
    try {
      const response = await axios.post(`http://127.0.0.1:8000/user/post/${postId}/write_comment`, {
        comment_text: commentText,
      }, {
        headers: { Authorization: authToken }
      });
      updatedPosts[index].comments.push({
        username: response.data.user,
        text: commentText,
        profileImage:response.data.image
      });
      setPosts(updatedPosts);
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/allpost/', {
          headers: { Authorization: authToken }
        });
        const postsWithLikedState = response.data.map(post => ({
          ...post,
          liked: post.liked_by_current_user,
          saved: post.saved_by_current_user,
        }));
    
        setPosts(postsWithLikedState);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [authToken]);

  const toggleComments = (index) => {
    const updatedPosts = posts.map((post, i) => {
      if (i === index) {
        return { ...post, showComments: !post.showComments };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div
      style={{
        marginTop:"10px",
        maxHeight:'85vh',
        overflowY: 'auto',
        padding: '10px',
        borderRadius: '8px',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
      }} 
      className='ml'
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
      }
        `}
      </style>
      {posts.map((post, index) => (
        <div
          key={index}
          className="card mb-3"
          style={{
            maxWidth: '500px',
            borderRadius: '0px',
            border: '1px solid #dbdbdb',
            margin: '0 auto',
          }}
        >
          <div className="card-body p-2">
            {/* Header Section */}
            <div className="d-flex align-items-center mb-2">
                      <div>
                <img
                  src={post.profileImage ? `http://127.0.0.1:8000${post.profileImage}` : img}
                  alt="profile"
                  style={{
                    width: post.profileImage ? '45px' : '53px', 
                    height: '45px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div>
                <h6 className={`mb-0 ${post.profileImage ? 'ms-2' : ''}`}  style={{ fontWeight: 'bold', fontSize: '0.85rem'}}>{post.userName}</h6>
                <p className={`mb-0 ${post.profileImage ? 'ms-2' : ''} text-muted`}  style={{ fontSize: '0.7rem' }}>
                  @{post.username} · {post.time} {post.date}
                </p>
              </div>
            </div>

            {/* Post Content */}
           
            <div>
              <img
                src={`http://127.0.0.1:8000/${post.image}`}
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
                    style={{ cursor: 'pointer', color: post.liked ? 'red' : 'black' }}
                    onClick={() => handleLike(post.postId, index)}
                    fill={post.liked ? 'red' : 'white'}
                  />
                  {post.likes > 0 && <span style={{ fontSize: '0.8rem' }}>{post.likes}</span>}
                </div>
                <div className="d-flex align-items-center" onClick={() => toggleComments(index)} style={{ cursor: 'pointer' }}>
                  <MessageCircle className="ms-1" style={{ cursor: 'pointer' }} />
                  {post.comments.length > 0 && <span style={{ fontSize: '0.8rem' }}>{post.comments.length}</span>}
                </div>
              </div>
              <div>
                <Bookmark
                  style={{ cursor: 'pointer', color: post.saved ? 'black' : 'black' }}
                  onClick={() => handleSaved(post.postId, index)}
                  fill={post.saved ? 'black' : 'white'}
                />
              </div>
            </div>

            <p className="mb-2" style={{ fontSize: '0.9rem', marginLeft: '4px' }}>
              {post.content}  
            </p>

      {post.showComments && (
        <div className="mt-2">
          <div className="text-center" style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
            {post.comments.length === 0 ? (
              <b>No comments</b>
            ) : (
              <b>Comments</b>
            )}
          </div>

          {post.comments.length > 0 &&
            post.comments.map((comment, idx) => (
              <div key={idx}>
                {/* Profile Image */}
                <div className="mt-2 d-flex align-items-center">
                  <img
                    src={comment.profileImage ? 'http://127.0.0.1:8000/'+comment.profileImage : img}
                    alt="profile"
                    style={{
                      width: comment.profileImage ? '45px' : '53px',
                      height: '45px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <strong className={ `${comment.profileImage ? 'ms-2' : ''}`} style={{ fontSize: '0.85rem', display: 'block' }}>{comment.username}</strong>
                </div>
              
                <div className="ms-5">
                <p class="mb-0" style={{backgroundColor: 'rgb(241, 241, 241)', padding: '8px 12px', borderRadius: '12px', fontSize: '0.85rem', marginTop: '-10px'}}>
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}

          {/* Comment input field */}
          <div>
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Write a comment..."
              value={commentInputs[post.postId] || ''} 
              onChange={(e) => handleCommentChange(e, post.postId)}
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
              onClick={() => handleCommentSubmit(post.postId, index)}
            />
          </div>

                    </div>
                  )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;