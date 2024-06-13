import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import LoginPage from '../pages/lander-pages/LoginPage'
import SignupPage from '../pages/lander-pages/SignupPage'
import OtpPage from '../pages/lander-pages/OtpPage'
import ForgetPasswordPage from '../pages/lander-pages/ForgetPasswordPage'
import NewPasswordPage from '../pages/lander-pages/NewPasswordPage'
import HomePage from '../pages/home-page/HomePage'
import ProtectedRoutes from '../components/Protected/ProtectedRoutes'
import { setSocketId } from '../redux/socketIO/socketIO';
import { baseUrl } from '../utils/baseUrl';
import { darkMode, lightMode } from '../utils/themeConfig';
import { addChatNotification, adduserNotification } from '../redux/userNotification/userNotification';
import ChatPage from '../pages/chat-page/ChatPage';
import { addTyping } from '../redux/typing/typing';
import VideoChat from '../components/Chat-section/VideoChat/VideoChat';

import ProtectedRouterAdmin from '../components/Protected/ProtectedRouterAdmin'
import AdminHomePage from '../pages/admin/AdminHomePage'

import PageNotFound from '../pages/PageNotFound/PageNotFound';

const MainRoutes = () => {

  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.value);
  const [colorMode, setColorMode] = useState(theme);

  const currentChat = useSelector(state => state.currentConversation.value)

  useEffect(() => {
    if (theme == "darkMode") {
      setColorMode(darkMode);
    } else {
      setColorMode(lightMode);
    }
  }, [theme]);

  useEffect(() => {
    const body = document.querySelector('body');
    body.setAttribute('data-bs-theme', colorMode.deskTopNav);
  }, [colorMode]);

  const { isAuthenticated } = useSelector(state => state.user);
  const socketId = useSelector(state => state.socketId.value);
  const user = useSelector((state) => state.user.userData);
  let userId

  if(user){
    userId = user._id
  }

  useEffect(() => {
    if (isAuthenticated) {
      const socket = io(baseUrl);
      socket.on('connect', () => {
        // Emit user ID to server
        socket.emit('setUserId', { userId });
        // Set socket ID in the Redux store
        dispatch(setSocketId(socket));
      });

      socket.on('notification', (response) => {

        dispatch(adduserNotification(response.notification))
      });

      socket.on("receiveNotification", (data) => {
        dispatch(addChatNotification(data.message));
      });

      socket.on('receivedTypingStatus',(data) => {
        dispatch(addTyping(data))
      })

    }
  }, [dispatch, isAuthenticated, userId]);

  useEffect(() => {
    if (socketId) {


      return () => {
        socketId.off("notification");
        socketId.disconnect();
      };
    }
  }, [socketId]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoutes><HomePage role={'homeFeeds'} /></ProtectedRoutes>}/>

        <Route path="/login" element={<LoginPage /> } />
        <Route path="/signup" element={<SignupPage /> } />
        <Route path="/otp-signup" element={<OtpPage role="signup" /> } />
        <Route path="/forgetpassword" element={<ForgetPasswordPage /> } />
        <Route path="/otp-forgetpassword" element={<OtpPage role="forgetpassword" /> } />
        <Route path="/new-password" element={<NewPasswordPage /> } /> 

        <Route path="/my-details" element={<ProtectedRoutes><HomePage role={'myDetails'} /></ProtectedRoutes>} />
        <Route path="/security" element={<ProtectedRoutes><HomePage role={'security'} /></ProtectedRoutes>} />
        <Route path="/saved-posts" element={<ProtectedRoutes><HomePage role={'savedPosts'} /></ProtectedRoutes>} />
        <Route path="/my-profile" element={<ProtectedRoutes><HomePage role={'myProfile'} /></ProtectedRoutes>} />
        <Route path="/user-profile/:id" element={<ProtectedRoutes><HomePage role={'userProfile'} /></ProtectedRoutes>} />
        <Route path="/add-post" element={<ProtectedRoutes><HomePage role={'addPost'} /></ProtectedRoutes>} />
        <Route path="/search" element={<ProtectedRoutes><HomePage role={'search'} /></ProtectedRoutes>} />
        <Route path="/post/:sharedPostId" element={<ProtectedRoutes><HomePage role={'singlePost'} /></ProtectedRoutes>} />

        <Route path="/chat" element={<ProtectedRoutes><ChatPage /></ProtectedRoutes>} />
        <Route path="/video-call" element={<ProtectedRoutes><VideoChat /></ProtectedRoutes>} />

        <Route path="/admin" element={ <AdminHomePage role={'dashboard'} /> } />
        <Route path="/all-users" element={ <ProtectedRouterAdmin><AdminHomePage role={'showAllUsers'} /></ProtectedRouterAdmin> } />
        <Route path="/all-posts" element={ <ProtectedRouterAdmin><AdminHomePage role={'allPosts'} /></ProtectedRouterAdmin> } />
        <Route path="/reported-posts" element={ <ProtectedRouterAdmin><AdminHomePage role={'reportedPosts'} /></ProtectedRouterAdmin> } />
        <Route path="/reported-users" element={ <ProtectedRouterAdmin><AdminHomePage role={'reportedUsers'} /></ProtectedRouterAdmin> } />

        <Route path="*" element={ <PageNotFound /> } />

      </Routes>
    </Router>
  )
}

export default MainRoutes
