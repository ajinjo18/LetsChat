import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { darkMode, lightMode } from '../../utils/themeConfig';
import { baseUrl } from '../../utils/baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setIsNotAuthenticated } from '../../redux/user/user';
import SquareSpinner from '../spinner/SquareSpinner/SquareSpinner';

const FollowingList = ({ userId, role, postId }) => {

    const [following, setFollowing] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const socketId = useSelector(state => state.socketId.value);

    const theme = useSelector(state => {
        if (role === 'admin') {
            return state.adminTheme.value;
        } else {
            return state.theme.value;
        }
    });

    const [colorMode, setColorMode] = useState(theme)

    useEffect(()=>{
        if(theme == 'darkMode'){
            setColorMode(darkMode)
        }
        else{
            setColorMode(lightMode)
        }
    },[theme])

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                setIsLoading(true)
                const response = await axiosInstance.get('/user/all-following');
                setFollowing(response.data);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                if (error.message === 'Refresh token expired') {
                    dispatch(setIsNotAuthenticated())
                    navigate('/login')
                } else {
                    console.error(error);
                }
            }
        };

        fetchFollowing();
    }, [userId, baseUrl]);

    const handleUserClick = (user) => {
        const updatedSelectedUsers = new Set(selectedUsers);
        if (updatedSelectedUsers.has(user._id)) {
            updatedSelectedUsers.delete(user._id);
        } else {
            updatedSelectedUsers.add(user._id);
        }
        setSelectedUsers(updatedSelectedUsers);
    };


    const handleSendClick = async () => {
        try {
            // Check if a conversation exists between sender and receiver
            for (const selectedUser of selectedUsers) {
                const response = await axios.get(`${baseUrl}/conversations/find/${userId}/${selectedUser}`);
                if (response.data) {
                    // Conversation exists, send message to the existing conversation
                    const conversationId = response.data._id;
                    await sendMessageToConversation({conversationId, selectedUser});
                } else {
                    // Conversation doesn't exist, create new conversation and send message
                    await createAndSendMessage(selectedUser, selectedUser);
                }
            }
            // Reset selected users after sending messages
            setSelectedUsers(new Set());
        } catch (error) {
            console.error('Error sending messages:', error.response.data);
        }
    };
    
    
    const sendMessageToConversation = async ({conversationId, selectedUser}) => {
        try {
            const message = {
                sender: userId,
                isLink: true,
                text: `post/${postId}`,
                conversationId: conversationId,
            };

            // const response = await axios.post(`${baseUrl}/messages`, {message});
            socketId.emit('sendMessage', { sender: userId, receiver: selectedUser, message: message });    
        } catch (error) {
            console.error('Error sending message to existing conversation:', error);
        }
    };
    
    const createAndSendMessage = async (receiverId, selectedUser) => {
        try {
            // Create new conversation
            const newConvResponse = await axios.post(`${baseUrl}/conversations?senderId=${userId}&receiverId=${receiverId}`);
            // const newConvResponse = await axiosInstance.post(`/api/new-conversation`, {
            //     senderId: userId,
            //     receiverId
            // });
    
            const conversationId = newConvResponse.data._id;    
            // Send message to the newly created conversation
            await sendMessageToConversation({conversationId, selectedUser});
        } catch (error) {
            console.error('Error creating and sending message:', error.response.data);
        }
    };
    
    


    return (
        <div>
            {isLoading ? (
                <>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                            overflowY: 'auto',
                            maxHeight: '300px',
                        }}
                        >
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                            key={index}
                            style={{
                                flex: '1 0 21%',
                                boxSizing: 'border-box',
                                margin: '10px',
                            }}
                            >
                            <SquareSpinner />
                            </div>
                        ))}
                    </div>
                </>
              
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflowY: 'auto', maxHeight: '300px' }}>
                    {following.map(user => (
                        <div
                            key={user._id}
                            onClick={() => handleUserClick(user)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                // width: '30%',
                                marginBottom: '25px',
                                cursor: 'pointer',
                                border: selectedUsers.has(user._id) ? '2px solid blue' : '1px solid gray',
                                borderRadius: '8px',
                                padding: '10px'
                            }}
                        >
                            <img
                                src={user.profilePicture ? `${baseUrl}/img/${user.profilePicture}` : '/default-profile.png'}
                                alt={`${user.firstName} ${user.lastName}`}
                                style={{ borderRadius: '50%', width: '20px', height: '20px', marginBottom: '1rem' }}
                            />
                            <div style={{ textAlign: 'center', fontSize: '1rem', color: colorMode.text, marginTop: '-15px' }}>
                                {user.firstName} {user.lastName}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedUsers.size > 0 && (
                <button onClick={handleSendClick} style={{ marginTop: '20px', padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', marginBottom:"20px" }}>
                    Send
                </button>
            )}
        </div>
    );
};

export default FollowingList;
