import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from 'react-bootstrap/Dropdown';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Avatar from "react-avatar-edit";
import { FaRegEdit } from "react-icons/fa";

import { darkMode, lightMode } from "../../../utils/themeConfig";
import { setIsAuthenticated } from "../../../redux/user/user";
import { successMessage } from "../../../utils/toaster";
import { baseUrl } from "../../../utils/baseUrl";
import { setIsNotAuthenticated } from "../../../redux/user/user";
import axiosInstance from "../../../utils/axiosInstance";
import { removeSocketId } from "../../../redux/socketIO/socketIO";
import CircleSpinner from "../../spinner/CircleSpinner/CircleSpinner";
import Post from "../../Post/Post";
import { updateDeletedPostStateFalse } from "../../../redux/deletePost/deletePost";
import { updatesentFollowRequestFalse } from "../../../redux/sentFollowRequest/sentFollowRequest";
import CommentSpinner from "../../spinner/CommentSpinner/CommentSpinner";



function ListFollowersFollowing({showFollowing, handleCloseFollowing, type, removeFolloing, removeFollower}) {

  const socketId = useSelector(state => state.socketId.value);
  const userId = useSelector(state => state.user.userData?._id);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [followingData, setFollowingData] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchFollowerData = async() => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/user/followers')
      setFollowingData(response.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.message === 'Refresh token expired') {
        dispatch(setIsNotAuthenticated())
        navigate('/login')
      } else {
        console.error(error);
      }
    }
  }

  const fetchFollowingData = async() => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/user/following')
      setFollowingData(response.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.message === 'Refresh token expired') {
        dispatch(setIsNotAuthenticated())
        navigate('/login')
      } else {
        console.error(error);
      }
    }
  }

  useEffect(()=>{
    if(type === 'following'){
      fetchFollowingData()
    }
    if(type === 'followers'){
      fetchFollowerData()
    }
  },[showFollowing])

  const showProfile = (id) => {
    navigate(`/user-profile/${id}`)
  }

  const unFollowRequest = (id) => {
    socketId.emit('unfollowUser', { userId, id });
    setFollowingData(prevData => prevData.filter(following => following._id !== id));
    removeFolloing()
  };

  const removeFollowers = (followerId) => {
    socketId.emit('removeFollower', { userId, followerId });
    setFollowingData(prevData => prevData.filter(follower => follower._id !== followerId));
    removeFollower()
  };

  return (
    <>
      <Modal show={showFollowing} onHide={handleCloseFollowing}>
        <Modal.Header closeButton>
          <Modal.Title>{type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ overflowY: 'auto', maxHeight: '280px', padding: '0 10px 10px 10px' }}>
              {
                  loading ? (
                      Array.from({ length: 8 }, (_, index) => (
                          <CommentSpinner key={index} />
                      ))
                  ) : (
                    followingData && followingData.map((like, likeIndex) => (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }} key={likeIndex}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img onClick={()=>showProfile(like._id)} src={`${baseUrl}/img/${like.profilePicture}`} alt="Your Image" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
                              <div style={{ marginLeft: '10px' }}>
                                  <h6 style={{ marginTop: '10px'}}>{like.firstName} {like.lastName}</h6>
                              </div>
                          </div>
                          {
                            type === 'following' && <Button style={{ width: '30%' }} variant="secondary" onClick={()=>unFollowRequest(like._id)} >Unfollow</Button>
                          }

                          {
                            type === 'followers' && <Button style={{ width: '30%' }} variant="danger" onClick={()=>removeFollowers(like._id)} >Remove</Button>
                          }
                              {/* <RiUserAddFill onClick={()=>sendFollowRequest(like._id)} /> */}
                      </div>
                    ))
                  )
              }
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}


const MyProfileView = () => {

  const socketId = useSelector(state => state.socketId.value);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const isPostDeleted =  useSelector(state => state.deletePost.value);
  const isSentFollowRequest =  useSelector(state => state.sentFollowRequest.value);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showFollowing, setShowFollowing] = useState(false);
  const [clickedOption, setClickedOption] = useState('')

  const handleCloseFollowing = () => setShowFollowing(false);
  const handleShowFollowing = (type) => {
    setClickedOption(type)
    setShowFollowing(true)
  }

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [imageCrop, setImageCrop] = useState("");

  const onCrop = (view) => {
    setImageCrop(view);
  };

  const onClose = () => {
    setImageCrop(null);
  };

  const userId1 = useSelector((state) => state.user.userData);
  const userId = userId1._id;

  const savePicture = async () => {
    try {
      // Get the base64 image data from imageCrop state
      const base64ImageData = imageCrop.replace(/^data:image\/\w+;base64,/, "");

      // Convert the base64 data to a blob
      const blob = b64toBlob(base64ImageData, "image/png");

      // Create a FormData object to send the blob as a file
      const formData = new FormData();
      formData.append("image", blob, "cropped-image.png"); // Adjust the filename as needed

      // Fetch request to upload the image to the server
      const response = await axiosInstance.post(
        '/user/update-profile-image',
        formData
      );

      const data = response.data;
      setImageCrop("");
      dispatch(setIsAuthenticated(data.updatedUser));
      successMessage("Uploaded successfully");
    } catch (error) {
      // dispatch(setIsNotAuthenticated())
      // navigate('/login')
      console.log(error.message);
    }

    handleClose();
  };

  // Function to convert base64 to Blob
  function b64toBlob(base64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const [data, setData] = useState("");

  const removeFolloing = () => {
    setData(prev =>({
      ...prev,
      followingLength: prev.followingLength - 1
    }))
  }

  const removeFollower = () => {
    setData(prev =>({
      ...prev,
      followersLength: prev.followersLength - 1
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/user/post-length?id=${userId}`);
        const postData = response.data;
        setData(postData);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        if (error.message === 'Refresh token expired') {
          dispatch(setIsNotAuthenticated())
          navigate('/login')
        } else {
          console.error(error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(()=>{
    if(isPostDeleted){
      setData(prev => ({
        ...prev,
        postLength: prev.postLength - 1
      }))
      dispatch(updateDeletedPostStateFalse())
    }
  },[isPostDeleted])

  useEffect(()=>{
    if(isSentFollowRequest){
      setData(prev => ({
        ...prev,
        followingLength: prev.followingLength + 1
      }))
      dispatch(updatesentFollowRequestFalse())
    }
  },[isSentFollowRequest])
  
  const ITEM_HEIGHT = 48;
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (path) => {
    handleCloseMenu();
    navigate(path);
  };

  const logoutFun = () => {
    socketId.disconnect()
    dispatch(removeSocketId())
    dispatch(setIsNotAuthenticated())
    navigate('/')
  }

  if(loading){
    return(<CircleSpinner />)
  }

  return (
    <>
      <div
        className='border border-light-subtle'
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "15px",
          marginBottom: "10px",
        }}
      >
        {data && userId1 && (
          <>
            {
              isMobile && (
                <div style={{textAlign:'end'}}>
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '15ch',
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleMenuItemClick('/security')}>Security</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('/my-details')}>My Details</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('/saved-posts')}>Saved Post</MenuItem>
                    <MenuItem onClick={logoutFun}>Logout</MenuItem>
                  </Menu>
                </div>
              )
            }
            <div style={{ textAlign: "center" }}>
              <img
                style={{
                  overflow: "hidden",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                }}
                src={`${baseUrl}/img/${userId1.profilePicture}`}
                alt=""
              />
              <FaRegEdit
                onClick={handleShow}
                style={{
                  marginTop: "-40px",
                  marginLeft: "-5px",
                }}
              />
            </div>
            <div style={{ marginTop: "10px", textAlign:'center' }}>
              <h5>{`${userId1.firstName} ${userId1.lastName}`}</h5>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "10px",
              }}
            >
              <div style={{ display: "block", textAlign: "center" }}>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "1em",
                  }}
                >
                  {data.postLength}
                </p>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "1em",
                    marginTop: "-20px",
                  }}
                >
                  posts
                </p>
              </div>
              <div style={{ display: "block", textAlign: "center" }}>
                <p
                  onClick={()=>handleShowFollowing('followers')}
                  style={{
                    marginTop: "10px",
                    fontSize: "1em",
                    cursor:'pointer'
                  }}
                >
                  {data.followersLength}
                </p>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "1em",
                    marginTop: "-20px",
                  }}
                >
                  followers
                </p>
              </div>
              <div style={{ display: "block", textAlign: "center" }}>
                <p
                  onClick={()=>handleShowFollowing('following')}
                  style={{
                    marginTop: "10px",
                    fontSize: "1em",
                    cursor:'pointer'
                  }}
                >
                  {data.followingLength}
                </p>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "1em",
                    marginTop: "-20px",
                  }}
                >
                  following
                </p>
              </div>
            </div>
            <ListFollowersFollowing 
              showFollowing={showFollowing} 
              handleCloseFollowing={handleCloseFollowing} 
              type={clickedOption} 
              removeFolloing={removeFolloing}
              removeFollower={removeFollower} 
            />
          </>
        )}
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-column allign-items-center">
              <div className="flex flex-column align-items-center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    width={300}
                    height={200}
                    onClose={onClose}
                    onCrop={onCrop}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={savePicture} variant="primary">
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Post role={"myProfile"} />
    </>
  );
};

export default MyProfileView;
