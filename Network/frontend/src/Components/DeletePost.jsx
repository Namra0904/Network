import React from 'react'
import { Modal,Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
const DeletePost = ({ postIdToDelete, showModal, setDeleteModel,handleDeletePost}) => {

    
    
  return (
    <div>
      <Modal show={showModal} onHide={()=>setDeleteModel(false)} centered keyboard={false} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title><b>Delete Post</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <b> Are you sure you want to delete this post?</b>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{setDeleteModel(false)}}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => handleDeletePost(postIdToDelete)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default DeletePost
