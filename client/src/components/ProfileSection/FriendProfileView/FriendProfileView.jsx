import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { darkMode, lightMode } from '../../../utils/themeConfig';
import { baseUrl } from '../../../utils/baseUrl';
import axiosInstance from '../../../utils/axiosInstance';
import { setIsNotAuthenticated } from '../../../redux/user/user'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import CircleSpinner from '../../spinner/CircleSpinner/CircleSpinner';

// import ThreeDotMenu from '../ThreeDotMenu/ThreeDotMenu';


const FriendProfileView = () => {

    const socketId = useSelector(state => state.socketId.value);
    const userId = useSelector(state => state.user.userData?._id);
    const { id } = useParams();
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        if (userId && id === userId) {
            navigate('/my-profile');
        }
    }, [userId, id, navigate]);

    const [isFollowing, setIsFollowing] = useState('');
    const [otherUserData, setOtherUserData] = useState('')
    const [data, setData] = useState('');

    const sendFollowRequest = () => {

        socketId.emit('followUser', { userId, id });
        setOtherUserData(prevData => {
            const updatedFollowing = [...prevData.followers, userId];
            return {
                ...prevData,
                followers: updatedFollowing
            };
        });

        setData(prev => ({
            ...prev,
            followersLength: prev.followersLength + 1
        }))

    };

    const unFollowRequest = () => {
        socketId.emit('unfollowUser', { userId, id });
        setOtherUserData(prevData => ({
            ...prevData,
            followers: prevData.followers.filter(followedId => followedId !== userId)
        }));

        setData(prev => ({
            ...prev,
            followersLength: prev.followersLength - 1
        }))
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get(`/user/get-other-user-data?id=${id}`);
                const userData = response.data;
                setOtherUserData(userData)
                // setFollowingData(userData);
                setLoading(false)
            } 
            catch (error) {
                setLoading(false)
                if (error.message === 'Refresh token expired') {
                    dispatch(setIsNotAuthenticated())
                    navigate('/login')
                } else {
                    console.error(error);
                }
            }
        };

        const fetchData = async () => {
            try {
              setLoading(true)
              const response = await axiosInstance.get(`/user/post-length?id=${id}`);
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

        if (userId && id) {
            fetchData();
            fetchUserData();
            // if(id){
            // }
            // else{
            // }
        }
    }, [userId, id]);


    if(loading){
        return(<CircleSpinner />)
      }


    return (
        <div className='border border-light-subtle' style={{ width: '100%', padding: '10px', borderRadius: '15px', marginBottom: '10px' }}>
            {otherUserData && data && (
                <>
                    <div style={{textAlign:'end'}}>
                        {/* <ThreeDotMenu id={id} /> */}
                    </div>
                    <div style={{ textAlign: 'center'}}>
                        <img
                        style={{ overflow: 'hidden', width: '70px', height: '70px', borderRadius: '50%' }}
                        src={`${baseUrl}/img/${otherUserData.profilePicture}`}
                        alt=""
                        />
                    </div>
                    <div style={{ marginTop: '10px', textAlign:'center' }}>
                        <h5>{otherUserData.firstName} {otherUserData.lastName}</h5>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
                        <div style={{ display: 'block', textAlign: 'center' }}>
                            <p style={{ marginTop: '10px', fontSize: '1em' }}>{data.postLength}</p>
                            <p style={{ marginTop: '10px', fontSize: '1em', marginTop: '-20px' }}>posts</p>
                        </div>
                        <div style={{ display: 'block', textAlign: 'center' }}>
                            <p style={{ marginTop: '10px', fontSize: '1em' }}>{data.followersLength}</p>
                            <p style={{ marginTop: '10px', fontSize: '1em', marginTop: '-20px' }}>followers</p>
                        </div>
                        <div style={{ display: 'block', textAlign: 'center' }}>
                            <p style={{marginTop: '10px', fontSize: '1em' }}>{data.followingLength}</p>
                            <p style={{ marginTop: '10px', fontSize: '1em', marginTop: '-20px' }}>following</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        {otherUserData.followers.includes(userId) ? (
                            <DropdownButton
                                as={ButtonGroup}
                                id='dropdown-variants-secondary'
                                variant='secondary'
                                title='Following'
                                style={{ width: '30%' }}
                            >
                                <Dropdown.Item onClick={unFollowRequest} eventKey="1">Unfollow</Dropdown.Item>
                            </DropdownButton>
                        ) : (
                            <Button onClick={sendFollowRequest} style={{ width: '30%' }} variant="primary">Follow</Button>
                        )}
                        <Button style={{ width: '30%' }} variant="secondary" onClick={()=>navigate(`/chat?id=${id}`)} >Message</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FriendProfileView;
