import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../utils/baseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsNotAuthenticated } from '../../redux/user/user';
import axiosInstance from '../../utils/axiosInstance';
import { RiUserAddFill } from "react-icons/ri";
import CommentSpinner from '../spinner/CommentSpinner/CommentSpinner';
import { updatesentFollowRequestTrue } from '../../redux/sentFollowRequest/sentFollowRequest';

const FollowersSuggections = ({role}) => {

    const socketId = useSelector(state => state.socketId.value);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userId1 = useSelector(state => state.user.userData)
    const userId = userId1._id


    useEffect(() => {
        const fetchFriendSuggestions = async () => {
          try {
            const response = await axiosInstance.get('/user/suggest-friends');
            setUsers(response.data);
            setLoading(false);
          } catch (error) {
            setLoading(false);
            if (error.message === 'Refresh token expired') {
                dispatch(setIsNotAuthenticated())
                navigate('/login')
            } else {
                console.error(error);
            }
          }
        };
    
        fetchFriendSuggestions();
      }, [userId]);

    const showProfile = (id) => {
        navigate(`/user-profile/${id}`)
    }

    const sendFollowRequest = (id) => {
        socketId.emit('followUser', { userId, id });
        setUsers(prev => {
            return prev.filter(user => user._id !== id)
        })
        dispatch(updatesentFollowRequestTrue())
    }


    return (

        <div style={{ overflowY: 'auto', maxHeight: '280px', padding: '0 10px 10px 10px' }}>
            {
                loading ? (
                    Array.from({ length: 8 }, (_, index) => (
                        <CommentSpinner key={index} />
                    ))
                ) : (
                    users && users.map((like, likeIndex) => (
                        like._id !== userId && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }} key={likeIndex}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img onClick={()=>showProfile(like._id)} src={`${baseUrl}/img/${like.profilePicture}`} alt="Your Image" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
                                    <div style={{ marginLeft: '10px' }}>
                                        <h6 style={{ marginTop: '10px'}}>{like.firstName} {like.lastName}</h6>
                                    </div>
                                </div>
                                    <RiUserAddFill onClick={()=>sendFollowRequest(like._id)} />
                            </div>
                        )
                    ))
                )
            }
        </div>
    );
}

export default FollowersSuggections
