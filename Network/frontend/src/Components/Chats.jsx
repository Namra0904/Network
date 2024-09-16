// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const users = [
//   { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
//   { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
//   { id: 3, name: 'Alice Johnson', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
// ];

// const Chats = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleSendMessage = () => {
//     // Handle message send logic here
//     setMessage('');
//   };

//   return (
//     <div className="container-fluid vh-100">
//       <div className="row h-100">
//         {/* Sidebar for User List */}
//         <div className="col-md-4 col-lg-3 p-0 border-end bg-light">
//           <div className="p-3 bg-primary text-white">
//             <h5>Chats</h5>
//             <input
//               type="text"
//               className="form-control mt-3"
//               placeholder="Search for users..."
//               style={{ borderRadius: '20px' }}
//             />
//           </div>

//           <div className="list-group user-list overflow-auto" style={{ maxHeight: '80vh' }}>
//             {users.map((user) => (
//               <button
//                 key={user.id}
//                 className={`list-group-item list-group-item-action d-flex align-items-center ${
//                   selectedUser?.id === user.id ? 'active' : ''
//                 }`}
//                 onClick={() => setSelectedUser(user)}
//               >
//                 <img
//                   src={user.avatar}
//                   alt={user.name}
//                   className="rounded-circle me-3"
//                   style={{ width: '40px', height: '40px' }}
//                 />
//                 <div>{user.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="col-md-8 col-lg-9 p-0">
//           {selectedUser ? (
//             <div className="d-flex flex-column h-100">
//               {/* Chat Header */}
//               <div className="p-3 bg-primary text-white d-flex align-items-center">
//                 <img
//                   src={selectedUser.avatar}
//                   alt={selectedUser.name}
//                   className="rounded-circle me-3"
//                   style={{ width: '40px', height: '40px' }}
//                 />
//                 <h5>{selectedUser.name}</h5>
//               </div>

//               {/* Chat Messages */}
//               <div className="flex-grow-1 p-3 chat-messages overflow-auto">
//                 {/* Example messages */}
//                 <div className="mb-3">
//                   <div className="bg-primary text-white p-2 rounded-3 w-75 ms-auto mb-2">
//                     Hi there!
//                   </div>
//                   <div className="bg-light text-dark p-2 rounded-3 w-75 mb-2">
//                     Hello! How are you?
//                   </div>
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="p-3 bg-light border-top">
//                 <div className="input-group">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Type a message..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                   />
//                   <button className="btn btn-primary" onClick={handleSendMessage}>
//                     Send
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="d-flex flex-column justify-content-center align-items-center h-100">
//               <h4 className="text-muted">You can chat with your friends</h4>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chats;
import React from 'react'

const Chats = () => {
  return (
    <div>
      
    </div>
  )
}

export default Chats
