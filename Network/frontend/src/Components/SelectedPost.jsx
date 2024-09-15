import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, SendHorizontal, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import img from "../assets/Images/pic_image.png";
import DeletePost from './DeletePost';

const SelectedPost = ({ showModal, setShowModal,selectedPost, authToken ,likeUnlike,savedUnsaved,handleDeletePost,setDeleteModel,deleteModel}) => {

  const [commentInputs, setCommentInputs] = useState({});
  const [showComments,setShowComments] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const confirmDelete = (postId) => {
    setPostIdToDelete(postId);
    setDeleteModel(true);
    setShowModal(false)
  };

  const handleCommentSubmit = async (postId, index) => {
    const commentText = commentInputs[postId];
    if (!commentText) return
    try {
      const response = await axios.post(`http://127.0.0.1:8000/user/post/${postId}/write_comment`, {
        comment_text: commentText,
      }, {
        headers: { Authorization: authToken },
      });
      selectedPost.comments.push({
        username: response.data.user , 
        text: commentText,
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <>
    <Modal show={showModal} onHide={() => setShowModal(false)} centered keyboard={false} animation={true}>
      <Modal.Body
        className="text-center"
        style={{
          maxHeight: '89vh',
          overflowY: 'auto',
          paddingRight: '15px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {selectedPost ? (
          <div
            key={selectedPost.index}
            className="card mb-3"
            style={{
              width: '100%',
              maxWidth: '600px',
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
                <div className="">
                  <h6 className="mb-0" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {selectedPost.userName}
                  </h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
                    @{selectedPost.username} · {selectedPost.time} {selectedPost.date}
                  </p>
                </div>
                <div className="ms-auto">
                 {selectedPost.is_owner && ( <Trash2
                    color="red"
                    size={21}
                    style={{ cursor: 'pointer' }}
                    onClick={() => confirmDelete(selectedPost.postId) }
                  />)}
                </div>
              </div>

              <div>
                <img
                  src={`http://127.0.0.1:8000/${selectedPost.image}`}
                  className="img-fluid rounded mb-2"
                  alt="Post"
                  style={{
                    width: '100%',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </div>

              <div className="d-flex justify-content-between mb-2 px-2">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center mr-2">
                    <Heart
                      style={{ cursor: 'pointer', color: selectedPost.liked_by_user ? 'red' : 'black' }}
                      onClick={() => likeUnlike(selectedPost.postId,selectedPost.index)}
                      fill={selectedPost.liked_by_user ? 'red' : 'white'}
                    />
                    {selectedPost.likes > 0 && <span style={{ fontSize: '0.8rem' }}>{selectedPost.likes}</span>}
                  </div>
                  <div
                    className="d-flex align-items-center"
                    onClick={() => setShowComments(!showComments)}
                    style={{ cursor: 'pointer' }}
                  >
                    <MessageCircle className="ms-1" />
                    {Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0 && (
                      <span style={{ fontSize: '0.8rem' }}>{selectedPost.comments.length}</span>
                    )}
                  </div>
                </div>
                <div>
                  <Bookmark
                    style={{ cursor: 'pointer', color: selectedPost.saved_by_user ? 'black' : 'black' }}
                    onClick={() => savedUnsaved(selectedPost.postId, selectedPost.index)}
                    fill={selectedPost.saved_by_user ? 'black' : 'white'}
                  />
                </div>
              </div>

             <div style={{textAlign:'Left',marginLeft:"8px"}}>
             <p className="mb-2" style={{ fontSize: '0.9rem' }}>
                {selectedPost.content}
              </p>

             </div>
              {showComments && (
                <div className="mt-2">
                  <div className="text-center" style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                    {Array.isArray(selectedPost.comments) && selectedPost.comments.length === 0 ? (
                      <b>No comments</b>
                    ) : (
                      <b>Comments</b>
                    )}
                  </div>

                  {Array.isArray(selectedPost.comments) &&
                    selectedPost.comments.length > 0 &&
                    selectedPost.comments.map((comment, idx) => (
                      <div key={idx}>
                          <div className="mt-2 d-flex align-items-center">
                  <img
                    src={comment.profileImage ? comment.profileImage : img}
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
                      textAlign:'left',
                    }}
                  >
                    {comment.text}
                  </p>
                </div>
                      </div>
                    ))}
                  <div className="mt-3">
                    <input
                      type="text"
                      className="form-control mt-3"
                      placeholder="Write a comment..."
                      value={commentInputs[selectedPost.postId] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [selectedPost.postId]: e.target.value })
                      }
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
          <p>No Post Selected</p>
        )}
      </Modal.Body>
    </Modal>
     <DeletePost postIdToDelete={postIdToDelete} showModal={deleteModel} setDeleteModel={setDeleteModel} handleDeletePost={handleDeletePost}/>
     </>
  );
 

};

export default SelectedPost;
