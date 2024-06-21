import React, { useEffect, useState } from 'react'
import Chat from '../../components/Chat-section/Chat/Chat'
import Conversation from '../../components/Chat-section/Conversation/Conversation'
import NavbarHome from '../../components/navbar/NavbarHome'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../../utils/axiosInstance'
import axios from 'axios'
import { baseUrl } from '../../utils/baseUrl'

import './chatPage.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { removeCurrentConversation, setCurrentConversation } from '../../redux/currentConversation/currentConversation'
import { setIsNotAuthenticated } from '../../redux/user/user'

const ChatPage = () => {

  const user = useSelector((state) => state.user.userData);
  const socketId = useSelector(state => state.socketId.value);
  const notifications = useSelector(state => state.notifications.chatNotifications)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState('');
  const [currentChatDetails, setCurrentChatDetails] = useState('')
  const [messages, setMessages] = useState([]);
  const [key, setKey] = useState(false)
  const [isId, setIsId] = useState(false)


  const setSearchQueryFun = (value) => {
    setSearchTerm(value);
  };

  useEffect(()=>{
    const handleSearch = async () => {
    try {
      if (searchTerm.trim().length >= 2) {
          const res = await axiosInstance.get(`/user/chat-user-search?query=${searchTerm.trim()}`);
          setSearchResults(res.data);
      }
      else{
        setSearchResults([]);
      }

    } catch (error) {
      if (error.message === 'Refresh token expired') {
        dispatch(setIsNotAuthenticated())
        navigate('/login')
      } else {
        console.error(error);
      }
    }
  };
  handleSearch()
  },[searchTerm])

  useEffect(()=>{
    if(currentChat){
        const receiver = currentChat.members.find(member => member._id !== user._id);
        setCurrentChatDetails(receiver)
    }
  },[currentChat])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${baseUrl}/conversations/` + user._id);
        if (!isId && id && res.data) {
          setIsId(true)
          setConversations(res.data);
          profileChat(res.data);
          return
        }
        setConversations(res.data);
        setKey(false);
        
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id, notifications, key]);


  const profileChat = async(res) => {

    let existingConversation = res.find(conv => conv.members[1]._id === id);

    if (!existingConversation) {
      // Conversation doesn't exist, create a new one
      try {
        const senderId = user._id;
        const receiverId = id;
        const res = await axios.post(`${baseUrl}/conversations?senderId=${senderId}&receiverId=${receiverId}`);
        setCurrentChat(res.data);
        // dispatch(removeCurrentConversation())
        // dispatch(setCurrentConversation(res.data))
        setKey(true);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    } else {
      // dispatch(removeCurrentConversation())
      setCurrentChat(existingConversation);
      // setKey(true);
      // dispatch(setCurrentConversation(existingConversation))
    }
};

  const handleConversationClick = async (clickedConversation) => {

    let existingConversation
    
    // Check if the clicked conversation already exists in the list of conversations
    if(clickedConversation?.email){
      existingConversation = conversations.find(conv =>
        conv.members.some(member => member._id === clickedConversation._id)
      );
    }
    else{
      existingConversation = conversations.find(conv => conv._id === clickedConversation._id);
    }
    
    if (!existingConversation) {
      // Conversation doesn't exist, create a new one
      try {
        // Assume senderId is the current user's ID, and receiverId is the ID of the clicked user
        const senderId = user._id;
        const receiverId = clickedConversation._id; // or any appropriate way to get receiverId
        
        // Make a request to create a new conversation
        const res = await axios.post(`${baseUrl}/conversations?senderId=${senderId}&receiverId=${receiverId}`);
        // Set the newly created conversation as the current chat
        setCurrentChat(res.data);
        dispatch(removeCurrentConversation())
        dispatch(setCurrentConversation(res.data))
        setKey(true)
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    } else {
      // Conversation already exists, set it as the current chat
      // dispatch(removeCurrentConversation())
      // await axios.post(`${baseUrl}/conversations/markallasread`,{
      //   userId: user._id,
      //   conversationId: clickedConversation._id
      // })
      // setKey(true);
      setCurrentChat(existingConversation);
      dispatch(removeCurrentConversation())
      dispatch(setCurrentConversation(existingConversation))
    }
  };

  useEffect(()=>{
    const changeStatus = async() => {
      await axios.post(`${baseUrl}/conversations/markallasread`,{
        userId: user._id,
        conversationId: currentChat._id
      })
    }
    changeStatus()
    setKey(true);
  },[currentChat, user._id, notifications])

  useEffect(() => {
    // Listen for 'receiveMessage' event from the server
    if (socketId) {
      socketId.on('receiveMessage', (data) => {

        if (!currentChat) {
          return;
        }

        if (currentChat._id === data.message.conversationId) { 
          setMessages(prevMessages => [data.message, ...prevMessages]);
        }
      });

      // Clean up the event listener when socketId or currentChat changes
      return () => {
        socketId.off('receiveMessage');
      };
    }
  }, [socketId, currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${baseUrl}/messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat?._id]);

  const handleSubmit = async (text, file) => {
    let message = {
      sender: user._id,
      text: text || '',
      conversationId: currentChat._id,
      isRead: false,
    };

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${baseUrl}/user/mediaUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      message.file = response.data.filePath;
    }

    const receiverId = currentChat.members.find((member) => member._id !== user._id)._id;
    if (socketId) {
      socketId.emit('sendMessage', { sender: user._id, receiver: receiverId, message: message });
      setMessages(prevMessages => [message, ...prevMessages]);
    }
  }

  return (
    <>
      <NavbarHome />
      <div style={{display:'flex', height:'100vh'}}>
          <div style={{width:'30%'}}>
            <input 
              className={'border border-light-subtle' }
              value={searchTerm}
              onChange={(e) => setSearchQueryFun(e.target.value)}
              type="text"
              placeholder="Type to search"
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px',
                outline: 'none',
                marginBottom:'5px',
                marginTop:'5px'
              }}
            />
            <div style={{height:'100vh'}} className="scrollableDiv border-top border-start border-end no-bottom-border">
            {
              searchResults.length > 0 && (
                <>
                  <p>Search results</p>
                  {searchResults.map((item, index) => (
                    <div key={index} onClick={()=>handleConversationClick(item)}>
                      <Conversation key={index} conv={item} currentUser={user} role={'search'} currentChat={currentChat} />
                    </div>
                  ))}
                </>
              )
            }

            {
              searchResults.length === 0 && conversations.length > 0 && conversations.map((item, index) => (
                <div key={index} onClick={()=>handleConversationClick(item)}>
                  <Conversation 
                    conv={item} currentUser={user} currentChat={currentChat}
                  />
                </div>
              ))
            }
            </div>
          </div>
          <div style={{width:'70%'}}>
            {
              currentChat && <Chat currentChat={currentChat} currentChatDetails={currentChatDetails} handleSubmit={handleSubmit} message={messages} />
            }
                
          </div>
      </div>
    </>
  )
}

export default ChatPage
