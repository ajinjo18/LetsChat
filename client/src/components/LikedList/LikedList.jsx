import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { baseUrl } from '../../utils/baseUrl';
import { darkMode, lightMode } from '../../utils/themeConfig';
import axiosInstance from '../../utils/axiosInstance';

const LikedList = ({userId, postData, role, followingData}) => {

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


    const sendFollowRequest = (id) => {
        socketId.emit('followUser', { userId, id });
    };

    const unFollowRequest = (id) => {
        socketId.emit('unfollowUser', { userId, id });
    };

    return (
        <div style={{ backgroundColor: colorMode.cardBackground, marginBottom: '10px', borderRadius: '8px', border: `1px solid ${colorMode.borderColor}` }}>
            <h6 style={{ color: colorMode.text }}>{postData.length} likes</h6>
            <hr style={{ color: colorMode.lightText }} />
            <div style={{ overflowY: 'auto', maxHeight: '300px', padding: '10px' }}>
                {postData.map((like, likeIndex) => (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }} key={likeIndex}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={`${baseUrl}/img/${like.profilePicture}`} alt="Your Image" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
                            <div style={{ marginLeft: '10px' }}>
                                <h6 style={{ marginTop: '10px', color: colorMode.text }}>{like.firstName} {like.lastName}</h6>
                            </div>
                        </div>
                        {
                            like._id === userId ? null : (
                                followingData.includes(like._id) ? (
                                    <>  
                                        <DropdownButton
                                            as={ButtonGroup}
                                            id='dropdown-variants-secondary'
                                            variant='second ary'
                                            title='Following'
                                            style={{width:'30%'}}
                                        >
                                            <Dropdown.Item onClick={()=>unFollowRequest(like._id)} eventKey="1">Unfollow</Dropdown.Item>
                                        </DropdownButton>
                                    </>
                                ) : (
                                    <Button onClick={()=>sendFollowRequest(like._id)} variant="primary">Follow</Button>
                                )
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LikedList
