// import React, { useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import SimplePeer from 'simple-peer';

// const VideoChat = () => {
//   const socket = useSelector(state => state.socketId.value);
//   const user = useSelector(state => state.user.userData);
//   const roomId = useSelector(state => state.room.currentRoom);

//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();
//   const initiator = roomId.split('-')[0] === user._id;

//   useEffect(() => {
//     // Acquire local media stream
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         console.log('Local stream:', stream);
//         myVideo.current.srcObject = stream;
//         myVideo.current.play();

//         const peer = new SimplePeer({
//           initiator,
//           trickle: false,
//           stream
//         });

//         peer.on('signal', signal => {
//           console.log('Sending signal:', signal);
//           socket.emit('signal', { signal, to: roomId.split('-')[1] });
//         });

//         peer.on('stream', remoteStream => {
//           console.log('Receiving remote stream:', remoteStream);
//           userVideo.current.srcObject = remoteStream;
//           userVideo.current.play();
//         });

//         peer.on('error', error => {
//           console.error('Peer error:', error);
//         });

//         peer.on('connect', () => {
//           console.log('Peer connected');
//         });

//         connectionRef.current = peer;
//       })
//       .catch(error => {
//         console.error('Error accessing media devices:', error);
//       });


//     socket.on('signal', (data) => {
//         console.log('Received signal:', data);
//         if (data && data.signal && data.from !== socket.id) {
//           connectionRef.current.signal(data.signal);
//         }
//       });
      

//     return () => {
//       socket.disconnect();
//       if (connectionRef.current) {
//         connectionRef.current.destroy();
//       }
//     };
//   }, [roomId, socket, initiator, userVideo]);

//   return (
//     <div>
//       <video ref={myVideo} muted playsInline autoPlay style={{ width: '300px' }} />
//       <video ref={userVideo} muted playsInline autoPlay style={{ width: '300px' }} />
//     </div>
//   );
// }

// export default VideoChat;



import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import SimplePeer from 'simple-peer';
import { useNavigate } from 'react-router-dom';
import './videoChat.css';  // Import the CSS file for styling

const VideoChat = () => {
  const socket = useSelector(state => state.socketId.value);
  const user = useSelector(state => state.user.userData);
  const roomId = useSelector(state => state.room.currentRoom);

  const navigate = useNavigate();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const initiator = roomId.split('-')[0] === user._id;

  useEffect(() => {
    // Acquire local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        console.log('Local stream:', stream);
        myVideo.current.srcObject = stream;
        myVideo.current.play();

        const peer = new SimplePeer({
          initiator,
          trickle: false,
          stream
        });

        peer.on('signal', signal => {
          console.log('Sending signal:', signal);
          socket.emit('signal', { signal, to: roomId.split('-')[1] });
        });

        peer.on('stream', remoteStream => {
          console.log('Receiving remote stream:', remoteStream);
          userVideo.current.srcObject = remoteStream;
          console.log('userVideo', userVideo)
          userVideo.current.play();
        });

        peer.on('error', error => {
          console.error('Peer error:', error);
        });

        peer.on('connect', () => {
          console.log('Peer connected');
        });

        connectionRef.current = peer;
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });

    socket.on('signal', (data) => {
      console.log('Received signal:', data);
      if (data && data.signal && data.from !== socket.id) {
        connectionRef.current.signal(data.signal);
      }
    });

    socket.on('endCall', () => {
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      navigate('/chat');
    });

    return () => {
      socket.off('signal');
      socket.off('endCall');
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, [roomId, socket, initiator, userVideo, navigate]);

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socket.emit('endCall', { to: roomId.split('-')[1] });
    navigate('/chat');
  };

  return (
    <div className="video-chat-container">
      <div className="video-container">
        <video ref={myVideo} muted playsInline autoPlay className="video-element" />
        <video ref={userVideo} playsInline autoPlay className="video-element" />
      </div>
      <button onClick={endCall} className="end-call-button">End Call</button>
    </div>
  );
};

export default VideoChat;
