import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

import "bootstrap/dist/css/bootstrap.min.css";
import { useMediaQuery } from "react-responsive";

import { IoIosNotificationsOutline } from "react-icons/io";
import { LuMessageCircle } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { MdClearAll } from "react-icons/md";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import ThemeToggle from "../themeToogle/ThemeToogle";
import { darkMode, lightMode } from "../../utils/themeConfig";

import Offcanvas from 'react-bootstrap/Offcanvas';

import axiosInstance from '../../utils/axiosInstance'
import { adduserNotification, clearChatNotification } from "../../redux/userNotification/userNotification";
import { FrondEndBaseUrl, baseUrl } from "../../utils/baseUrl";
// import SearchBar from "../SearchBar/SearchBar";
import { setIsNotAuthenticated } from "../../redux/user/user";
import SearchBar from "../SearchBar/SearchBar";
import { toast } from "react-toastify";
import { FaVideo } from "react-icons/fa";
import { setRoom } from "../../redux/roomSlice/roomSlice";
import { errorMessage } from "../../utils/toaster";

const Show = ({ show, handleClose, notifications, userNotifications }) => {

  const currentChat = useSelector(state => state.currentConversation.value)

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            aria-live="polite"
            aria-atomic="true"
            className="position-relative"
          >
            <ToastContainer
              className="p-3"
              position='top-center'
              style={{ zIndex: 1 }}
            >
              {
                notifications.length > 0 && (
                  <div>
                    <p>chats</p>
                    {Array.isArray(notifications) && [...notifications].reverse().map((item, index) => (
                       <Toast style={{ marginBottom:'10px'}} key={index}>              
                            <Toast.Header closeButton={false}>
                          <img
                            // src="holder.js/20x20?text=%20"
                            src={`${baseUrl}/img/${item?.profilePicture}`}
                            style={{width:'50px', height:'50px'}}
                            className="rounded me-2"
                            alt=""
                          />
                          <strong className="me-auto">{item.firstName+' '+item.lastName}</strong>
                          <small>{format(item.date)}</small>
                        </Toast.Header>
                        <Toast.Body>
                          {/* {item.text.map((text, idx) => ( */}
                            <div>{item.isLink ? FrondEndBaseUrl+'/'+item.text : item.text }</div>
                          {/* ))} */}
                        </Toast.Body>                       
                      </Toast>
                    ))}
                  </div>
                )
              }
              <div>
                {
                  userNotifications && (
                    <p style={{marginTop:'20px'}}>other notifications</p>
                  )
                }
                {userNotifications && userNotifications.map((item, index) => (
                  <Toast style={{marginBottom:'10px'}} key={index}>
                    <Toast.Header closeButton={false}>
                      <img
                        src={`${baseUrl}/img/${item?.profilePicture}`}
                        style={{width:'50px', height:'50px'}}
                        className="rounded me-2"
                        alt=""
                      />
                      <strong className="me-auto">{item.firstName+' '+item.lastName}</strong>
                      <small>{format(item.createdAt)}</small>
                    </Toast.Header>
                    <Toast.Body>
                      {/* {item.text.map((text, idx) => ( */}
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <div>
                            {item.type === 'like' ? 'liked your post': ''}
                            {item.type === 'comment' ? 'commented your post': ''}
                            {item.type === 'reply' ? 'replied on your comment': ''}
                            {item.type === 'follow' ? 'started following you': ''}
                          </div>
                          {
                            item?.images && (
                              <div>
                                <img src={`${baseUrl}/img/${item?.images}`} alt="" style={{width:'50px', height:'50px'}} />               
                              </div>
                            )
                          }
                        </div>
                      {/* ))} */}
                    </Toast.Body>
                  </Toast>
                ))}
              </div>
            </ToastContainer>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}



const NavbarHome = ({type}) => {

  const theme = useSelector((state) => state.theme.value);
  const socketId = useSelector(state => state.socketId.value);

  const [colorMode, setColorMode] = useState(theme);

  useEffect(() => {
    if (theme == "darkMode") {
      setColorMode(darkMode);
    } else {
      setColorMode(lightMode);
    }
  }, [theme]);

  const [userNotifications, setUserNotifications] = useState([])
  const [unSeen, setUnSeen] = useState([])

  const notifications = useSelector(state => state.notifications.chatNotifications)
  const newUserNotifications = useSelector((state) => state.notifications.userNotifications)
  const currentConversation = ''
//   useSelector(state => state.currentConversation.value)

  const userId1 = useSelector(state => state.user.userData)
  const userId = userId1._id

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAccept = (roomId) => {
    dispatch(setRoom(roomId));
    socketId.emit('call accepted', { roomId });
    navigate('/video-call')
    toast.dismiss();
  };

  useEffect(() => {
    if (socketId) {
      socketId.on('incoming call', (data) => {
        toast(
          <>
            <p><FaVideo style={{marginRight:'10px'}} />Incoming Call from {data.user}</p>
            <div style={{padding:'10px', textAlign:'center', display:'flex', justifyContent:'space-around'}}>
              <button className='btn btn-success' onClick={() => handleAccept(data.roomId)}>Accept</button>
              <button className='btn btn-danger' onClick={() => toast.dismiss()}>Reject</button>
            </div>
          </>,
          {
            autoClose: false,
            closeButton: false,
          }
        );
      });

      socketId.on('user blocked',()=>{
        dispatch(setIsNotAuthenticated())
        errorMessage('Account Blocked')
        navigate('/')
      })
    }
  }, [socketId])


  useEffect(()=>{
    const fetchNotifications = async() => {
      try {
        const response = await axiosInstance.get('/user/notifications')
        if(response){
          setUserNotifications([])
          const notifications = response.data.notifications.notifications;
          const filteredNotifications = notifications.filter(item => item.userId !== userId);
          setUserNotifications(filteredNotifications.reverse());
          const unRead = filteredNotifications.filter(item => item?.isRead == "false")
          setUnSeen(unRead)
        }
      } catch (error) {
        if (error.message === 'Refresh token expired') {
          dispatch(setIsNotAuthenticated())
          navigate('/login')
        } else {
          console.error(error);
        }
      }
    }

    fetchNotifications()

  },[newUserNotifications])


  const [show, setShow] = useState(false);

  const handleClose = async() => {
    setShow(false)
    const response = await axiosInstance.put('/user/markAllAsRead');
    if (response.status === 200) {
      setUnSeen([])
    }
    dispatch(clearChatNotification())
  }
  const handleShow = () => setShow(true);


  const showChat = () => {
    navigate("/chat");
  };

  const showProfile = () => {
    navigate(`/user-profile/${userId}`)
  }

  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (isMobile) {
    return (
      <div className={`bg-${colorMode.deskTopNav}` } style={{ height: '12vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', position: type !== 'chat' ? 'fixed' : 'auto'  }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <div style={{ padding: '6px' }}>
            <img onClick={() => navigate("/")} style={{ width: "50px", height: '50px', cursor: 'pointer' }} src="/logo.png" alt="" />
          </div>
          <div style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
            <div style={{ paddingRight: '50px' }}>
              <ThemeToggle />
            </div>
            <div style={{ paddingRight: '50px',position: 'relative'}}>
              <IoIosNotificationsOutline
                onClick={handleShow}
                style={{
                  fontSize: "2em",
                  cursor: "pointer"
                }}
              />
              { unSeen && unSeen.length > 0 && (
                <div
                  style={{
                    top: '-12px',
                    position: 'absolute',
                    width: '25px',
                    height: '25px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    fontSize: '0.8em',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {unSeen.length < 100 ? unSeen.length : '99+'}
                </div>
              )}
            </div>
            <div>
              <LuMessageCircle
                onClick={showChat}
                style={{
                  fontSize: "2em",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>
          {
            show && (
              <Show show={show} handleClose={handleClose} notifications={notifications} userNotifications={userNotifications} />
            )
          }

      </div>
    );
  }

  return (
    <div className='border border-light-subtle' style={{ height: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <div style={{ padding: '6px' }}>
          <img onClick={() => navigate("/")} style={{ width: "50px", height: '50px', cursor: 'pointer' }} src="/logo.png" alt="" />
        </div>
        <div style={{ padding: '10px' }}>
        <SearchBar />
        </div>
        <div style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
          <div style={{ paddingRight: '50px' }}>
            <ThemeToggle />
          </div>
          <div style={{ position: 'relative', paddingRight: '50px' }}>
            <IoIosNotificationsOutline
              onClick={handleShow}
              style={{
                fontSize: '2em',
                cursor: 'pointer'
              }}
            />
            {unSeen && unSeen.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  width: '25px',
                  height: '25px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {unSeen.length < 100 ? unSeen.length : '99+'}
              </div>
            )}
          </div>

          <div>
            <LuMessageCircle
              onClick={showChat}
              style={{
                fontSize: "2em",
                cursor: "pointer",
              }}
            />
          </div>

          <div style={{marginLeft: '50px'}}>
            <img onClick={showProfile} style={{width:'40px', cursor:'pointer'}} src={`${baseUrl}/img/${userId1?.profilePicture}`} alt="" />
          </div>

        </div>
      </div>

      {
        show && (
          <Show show={show} handleClose={handleClose} notifications={notifications} userNotifications={userNotifications} />
        )
      }
    </div>
  );
};

export default NavbarHome;
