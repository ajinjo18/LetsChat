import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { format } from "timeago.js";
import './message.css';
import { FrondEndBaseUrl, baseUrl } from '../../../utils/baseUrl';
import { Link } from 'react-router-dom';

const Message = ({ message, own }) => {
  const [showModal, setShowModal] = useState(false);

  // Function to determine if the file is a video based on its extension
  const isVideoFile = (fileName) => {
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = fileName.split('.').pop().toLowerCase();
    return videoExtensions.includes(extension);
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

   const handleDownloadImage = async () => {
    try {
      const response = await fetch(`${baseUrl}/img/${message.file}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = message.file.split('/').pop(); // Use the file name from the path
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  }

  return (

    <div className={`chat-bubble ${own ? 'user' : 'bot'}`}>
      {message.isLink ? (
          <Link
            className="message-text"
            to={`${FrondEndBaseUrl}/${message.text}`}
            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {FrondEndBaseUrl}/{message.text}
          </Link>
      ) : message.text !== ''  ? (
        <p className="message-text">
          {message.text}
          <br />
          <i style={{ fontSize: '0.7em' }}>{format(message.createdAt)}</i>
        </p>
      ) : (
        <p className="message-text">
          {isVideoFile(message.file) ? (
            <video controls style={{ width: '200px', height: 'auto' }}>
              <source src={`${baseUrl}/img/${message.file}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <img
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                src={`${baseUrl}/img/${message.file}`}
                alt=""
                onClick={handleImageClick}
              />
              <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body>
                  <img
                    style={{ width: '100%', height: 'auto' }}
                    src={`${baseUrl}/img/${message.file}`}
                    alt=""
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleDownloadImage}>
                    Save Image
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
          <br />
          <i style={{ fontSize: '0.7em' }}>{format(message.createdAt)}</i>
        </p>
      )}
    </div>

  );
};

export default Message;
