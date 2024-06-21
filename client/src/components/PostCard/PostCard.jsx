import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from "timeago.js";
import { useNavigate } from 'react-router-dom';

import './postCard.css';

import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FiSend} from "react-icons/fi";
import { GoBookmark } from "react-icons/go";
import { GoBookmarkFill } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { FcLike } from "react-icons/fc";

import CommentsList from '../Comments/CommentsList';
import { baseUrl } from '../../utils/baseUrl';
import ImageCarousel from '../ImageCarousel/ImageCarousel'
import FollowingList from '../FollowingList/FollowingList'
import ListSavedCategory from '../ListSavedCategory/ListSavedCategory'
import PostMenu from '../PostMenu/PostMenu'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axiosInstance from '../../utils/axiosInstance';

const MyVerticallyCenteredModal = (props) => {

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="modal-custom"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="modal-body-content">
              <div className="image-section">
                {props.item.images.length === 0 ? null : (
                  props.item.images.length > 1 ? (
                    <ImageCarousel images={props.item.images} />
                  ) : (
                    <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
                      <img
                        src={`${baseUrl}/img/${props.item.images[0]}`}
                        style={{ maxWidth: '100%', maxHeight: '100%', minHeight: '100px', borderRadius: '5%', padding: '10px' }}
                      />
                    </div>
                  )
                )}
              </div>
              <div className="comments-section">
                <CommentsList id={props.item._id} type={'popup'} />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      );
}


const PostCard = ({ item, role, removeSavedPost, deletePost }, ref) => {

    console.log('item', item)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [modalShow, setModalShow] = React.useState(false);

    const socketId = useSelector(state => state.socketId.value);

    const userId1 = useSelector(state => state.user.userData)
    const userId = userId1?._id

    const [liked, setLiked] = useState(item?.likes?.some(like => like?._id === userId));
    const [likeCount, setLikeCount] = useState(item?.likes?.length);

    const handleLikeClick = () => {
        likePost(item._id);
        setLiked(!liked);
        setLikeCount(likeCount + (liked ? -1 : 1));
    };

    const [showComments, setShowComments] = useState(false); // State to manage comment section visibility
    const [showShare, setShowShare] = useState(false)
    const [showLikedList, setShowLikedList] = useState(false)

    // Toggle comment section visibility
    const toggleComments = () => {
        setShowShare(false)
        setShowLikedList(false)
        setShowComments(!showComments);
    };

    // Toggle share section visibility
    const toggleShare = () => {
        setShowComments(false)
        setShowLikedList(false)
        setShowShare(!showShare);
    };

    // Toggle liked-list section visibility
    // const toggleLikedList = () => {
    //     setShowComments(false)
    //     setShowShare(false)
    //     setShowLikedList(!showLikedList);
    // };

    const likePost = (id) => {
        if(socketId){
            socketId.emit('likePost', { id, userId });
        }
    };


    const showProfile = (id) => {
        navigate(`/user-profile/${id}`)
    }

    const removePost = async() => {
        removeSavedPost(item._id)
    }


    return (       
        item && (
            <div className="app-container" ref={ref}>
                <div className="post-container border border-light-subtle">
                    <div style={{textAlign:'end'}}>
                        <PostMenu postId={item._id} role={role} postUserId={item.userId._id} deletePost={deletePost}/>
    
                        {/* {
                            userId !== item.userId._id && (
                                <PostMenu postId={item._id} />
                            )
                        } */}
                    </div>
                    <div className="post-header">
                        <img onClick={()=>showProfile(item.userId._id)} className="avatar" src={`${baseUrl}/img/${item?.userId?.profilePicture}`} alt="User" />
                        <div className="user-info">
                            <span className="username">{item.userId.firstName} {item.userId.lastName}</span>
                            <span className="time">{format(item.createdAt)}</span>
                        </div>
                    </div>
                    {
                        item?.description && (
                            <div style={{padding:'10px'}}>
                                <p>{item?.description}</p>
                            </div>
                        )
                    }
                    <div style={{textAlign:'center'}} >
    
                        <div>
                            <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                item={item}
                            />
                        </div>
    
    
                    {
                        item.images.length === 0 ? null : (
                            item.images.length > 1 ? (
                                <div onClick={() => setModalShow(true)}>
                                    <ImageCarousel images={item.images} />
                                </div>
                            ) : (
                                <div onClick={() => setModalShow(true)} style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
                                    <img
                                        src={`${baseUrl}/img/${item.images[0]}`}
                                        style={{ maxWidth: '100%', maxHeight: '100%', minHeight: '100%', borderRadius: '5%', padding:'10px' }}
                                    />
                                </div>
                            )
                        )
                    }
                    </div>
                    <div className="likes">{likeCount} likes</div>
                    <div className="post-actions">
                        <div className="left-actions">
                            {
                                liked ? (
                                    <FcLike onClick={handleLikeClick} style={{ fontSize: '1.7em' }} />
                                ) : (
                                    <CiHeart onClick={handleLikeClick} style={{ fontSize: '1.7em' }} />
                                )
                            }                      
                            <FaRegComment style={{ fontSize: '1.5em' }} onClick={toggleComments} />
                            <FiSend onClick={toggleShare} style={{ fontSize: '1.5em' }} />
                        </div>
                        <div className="right-actions">
                            {
                                role === 'savedPosts' ? (
                                    <GoBookmarkFill onClick={removePost} style={{fontSize:'1.5em'}} />
                                ) : (
                                    <ListSavedCategory id={item._id} />
                                )
                            }
                            {/* <GoBookmark onClick={showSavePost} style={{ fontSize: '1.5em', color: colorMode.lightText }} /> */}
                        </div>
                    </div>
    
                    {showComments && (
                        <div className="comment-section">
                            <CommentsList id={item._id} />
                        </div>
                    )}
    
                    {showShare && (
                        <div className="comment-section" style={{textAlign:'center'}}>
                            <FollowingList userId={userId} role={role} postId={item._id} />
                        </div>
                    )}
                    
    
                    {/* {showLikedList && (
                        <div className="comment-section" style={{textAlign:'center'}}>
                            <LikedList userId={userId} postData={item.likes} role={role} />
                        </div>
                    )} */}
                </div>
            </div>
        )     
    );
};

export default React.forwardRef(PostCard);
