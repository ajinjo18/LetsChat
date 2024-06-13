// src/components/Chat-section/IncomingVideoCall/IncomingVideoCall.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setRoom } from '../../../redux/roomSlice/roomSlice';
import { useNavigate } from 'react-router-dom';

const IncomingVideoCall = ({ roomId, callerId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // const handleAccept = () => {
  //   dispatch(setRoom(roomId));
  //   navigate('/video-call')
  // };

  return (
    <div>
      <h3>Incoming Call from {callerId}</h3>
      <button>Accept</button>
      <button>Reject</button>
    </div>
  );
};

export default IncomingVideoCall;
