import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Bookmark, SendHorizontal } from 'lucide-react';
import axios from 'axios';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  const [userID, setId] = useState(() => localStorage.getItem('userId') || '');

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
      console.log(authToken)
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/allpost/', {
          headers: { Authorization: authToken }
        });
        const postsWithLikedState = response.data.map(post => ({
          ...post,
          liked: post.liked_by_current_user, 
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
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '10px',
        borderRadius: '8px',
        // Hiding scrollbar while keeping the content scrollable
        scrollbarWidth: 'none', // For Firefox
        msOverflowStyle: 'none', // For IE and Edge
      }}
    >
      <style>
        {`
          /* For WebKit-based browsers like Chrome, Safari, and newer Edge */
          div::-webkit-scrollbar {
            display: none;
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
                <h6 className="mb-0" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{post.username}</h6>
                <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
                  @{post.username} · {post.date}
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
                  <span style={{ fontSize: '0.8rem' }}>{post.likes}</span>
                </div>
                <div className="d-flex align-items-center" onClick={() => toggleComments(index)} style={{ cursor: 'pointer' }}>
                  <MessageCircle className="ms-1" style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.8rem' }}>{post.comments.length}</span>
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
                <div>
                <input
        type="text"
        className="form-control"
        placeholder="Write a comment..."
        style={{
          fontSize: '0.8rem',
          padding: '0.35rem',
          paddingRight: '2.5rem', // Adjust padding to make space for the icon
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
          marginTop:'-25px'
        }}
        size={20}
        onClick={() => console.log('Send comment')}
      />
                </div>
                {post.comments.map((comment, idx) => (
                  <div key={idx} className="mt-2 d-flex align-items-center">
                    <strong style={{ fontSize: '0.8rem' }}>{comment.username}</strong>
                    <p className="mb-1" style={{ fontSize: '0.8rem', marginLeft: '8px' }}>{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
