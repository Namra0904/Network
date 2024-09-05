import './App.css'
import LoginPage from './Pages/login'
import Register from './Pages/signup'
import OTPVerification from './Pages/verify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Layout from './Pages/Layout';
import Post from './Components/Post';
import Chats from './Components/chats';
import Search from './Components/Search';
import Profile from './Components/Profile';
import Saved from './Components/Saved';
// import CreatePostModal from './Components/CreatePost';
function App(){
  return (
    <>

     <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<Register />} />
    <Route path="/verify" element={<OTPVerification />} />
    <Route path="/home" element={<Layout />}>   
           {/* <Route index element={<Post />} /> */}
            <Route path="post" element={<Post />} />
            <Route path="search" element={<Search />} />
            <Route path="chats" element={<Chats />} />
            <Route path="profile" element={<Profile />} />
            <Route path="saved" element={<Saved />}></Route>
            {/* <Route path="create-post" element={<CreatePostModal />} /> */}
    </Route>

      </Routes>
    
     </Router>
      
    </>
  );
}

export default App;
