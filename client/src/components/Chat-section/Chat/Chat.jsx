import React, { useEffect, useState } from 'react'

import './chat.css'

import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import { IoSend } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { IoMdVideocam , IoMdCloseCircle} from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { baseUrl } from '../../../utils/baseUrl';
import Message from '../Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineEmojiEmotions } from "react-icons/md";

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { setRoom } from '../../../redux/roomSlice/roomSlice';
import { useNavigate } from 'react-router-dom';

const Chat = ({currentChat, currentChatDetails, handleSubmit, message}) => {

  const socketId = useSelector(state => state.socketId.value);
  const typing = useSelector(state => state.typing.value);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.userData);


  const [typedMessage, setTypedMessage] = useState('')
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(()=>{
    setTypedMessage('')
    setShowEmojiPicker(false)
    if (socketId) {
      const receiverId = currentChat.members.find((member) => member._id !== user._id);
      socketId.emit('typingStatus', { sender: user._id, receiver: receiverId._id, text:''});
    }  },[handleSubmit, currentChat])


  const addText = (text) => {
    setTypedMessage(text)
    // if(text !== ''){
      if (socketId) {
        const receiverId = currentChat.members.find((member) => member._id !== user._id);
        socketId.emit('typingStatus', { sender: user._id, receiver: receiverId._id, text:text});
      }
    // }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split('/')[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setIsVideo(fileType === 'video');
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setIsVideo(false);
  };

  const send = () => {
    if (typedMessage.trim() !== '' || file) {
      handleSubmit(typedMessage, file);
      setTypedMessage('');
      removeFile()
    }
  }

  const handleEmojiSelect = (emoji) => {
    setTypedMessage(typedMessage + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const areSenderAndReceiverInChat = (currentChat, senderId, receiverId) => {
    const memberIds = currentChat.members.map(member => member._id);
    return memberIds.includes(senderId) && memberIds.includes(receiverId);
  }

  const startVideoCall = () => {
    const roomId = `${user._id}-${currentChatDetails._id}`;
    dispatch(setRoom(roomId));
    const receiverId = currentChat.members.find((member) => member._id !== user._id);
    socketId.emit('start call', { roomId, callerId: user._id, receiverId: receiverId._id, user: receiverId.firstName+' '+receiverId.lastName });
    navigate('/video-call');
  };

    return (
        <div className="full-height-container">
          <div>
            <ListGroup as="ol">
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <img
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  src={`${baseUrl}/img/${currentChatDetails.profilePicture}`}
                  alt=""
                />
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{currentChatDetails.firstName+' '+currentChatDetails.lastName}</div>
                  {
                    typing && currentChat && areSenderAndReceiverInChat(currentChat, typing.sender, typing.receiver) && (
                      <i>typing...</i>
                    )
                  }
                </div>
                <div className="d-flex">
                  {/* <IoMdVideocam onClick={startVideoCall} style={{ fontSize: '2em', marginRight:'30px', cursor:'pointer' }} />
                  <IoCall style={{ fontSize: '2em', marginRight:'40px', cursor:'pointer' }} />
                  <CiMenuKebab style={{ fontSize: '2em', marginRight:'30px', cursor:'pointer' }} /> */}
                </div>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <div className="parent-container">
            <div className="chat-container">
              <div className="messages">
                {message.map((mes, index) => (
                  <Message key={index} message={mes} own={mes.sender === user._id} />
                ))}
              </div>
            </div>
            {
              filePreview && (
                <div style={{ width: '100%' }}>
                  {isVideo ? (
                    <video src={filePreview} controls style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  ) : (
                    <img src={filePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  )}
                  <IoMdCloseCircle
                    onClick={removeFile}
                    style={{ fontSize: '2em', cursor: 'pointer', marginLeft: '20px', color: 'red' }}
                  />
                </div>
              )
            }
           {showEmojiPicker && (
              <div style={{
                position: 'absolute',
                top: '50%', // Adjust this to position the popup vertically
                left: '50%', // Adjust this to position the popup horizontally
                transform: 'translate(-50%, -50%)', // Center the popup
                zIndex: 9999, // Ensure it appears above other content
                backgroundColor: 'white', // Set background color
                padding: '10px', // Add padding
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', // Add box shadow
                borderRadius: '5px', // Add border radius
              }}>
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            )}
          <div>
          </div>
            <ListGroup as="ol">
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div style={{ width: '100%'}}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput">
                    <IoMdAttach style={{ fontSize: '2em', cursor: 'pointer', marginLeft: '20px' }} />
                  </label>
                  <input
                    className="border border-light-subtle"
                    value={typedMessage}
                    onChange={(e) => addText(e.target.value)}
                    type="text"
                    placeholder="Message"
                    style={{
                      width: '60%',
                      padding: '10px 40px 10px 10px',
                      outline: 'none',
                      marginBottom: '5px',
                      marginTop: '5px',
                      marginLeft: '40px',
                    }}
                  />
                  <IoSend onClick={send} style={{ fontSize: '2em', marginLeft: '-40px', cursor: 'pointer' }} />
                  <MdOutlineEmojiEmotions onClick={toggleEmojiPicker} style={{fontSize:'2em', marginLeft: '40px', cursor: 'pointer'}} />
                </div>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      );
}

export default Chat
