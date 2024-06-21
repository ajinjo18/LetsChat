import React, { useEffect, useState } from 'react'

// import './conversation.css'

import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { baseUrl } from '../../../utils/baseUrl';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../utils/axiosInstance';
import { setIsNotAuthenticated } from '../../../redux/user/user';

const Conversation = ({ conv, currentUser, role, currentChat }) => {

  const [user, setUser] = useState(null);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (role === 'search') {
      if(conv._id === currentUser._id) {
        return
      }
      setUser(conv);
    } else {
      const friendId = conv.members.find(member => member._id !== currentUser._id);
      const getUser = async () => {
        try {
          const res = await axiosInstance(`/user/get-other-user-data?id=` + friendId._id);
          setUser(res.data);
        } catch (error) {
          if (error.message === 'Refresh token expired') {
            dispatch(setIsNotAuthenticated())
              navigate('/login')
          } else {
              console.error(error);
          }
        }
      };
      getUser();
    }
  }, [currentUser, conv, role]);


  return (
    <div>
        {
          user && (
            <div style={{marginBottom:'5px'}}>
              <ListGroup as="ol">
                  <ListGroup.Item
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                  >
                      <img style={{width:'50px', height:'50px', borderRadius:'50%'}} src={`${baseUrl}/img/${user.profilePicture}`} alt="" />
                      <div className="ms-2 me-auto">
                      <div className="fw-bold">{user.firstName + ' '+user.lastName}</div>
                      <p>{conv.lastMessage && conv.lastMessage.text}</p>
                      {
                        user.isOnline === 'true' && (
                          <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: 'green', display: 'inline-block' }}></span>
                        )
                      }
                      </div>
                      <Badge bg="primary" pill>
                        {
                          currentChat?._id !== conv._id && (
                            conv?.unreadMessageCount === 0 ? '' : conv?.unreadMessageCount
                            )
                        }
                      </Badge>
                  </ListGroup.Item>
              </ListGroup>
            </div>
          )
        }
    </div>
  )
}

export default Conversation
