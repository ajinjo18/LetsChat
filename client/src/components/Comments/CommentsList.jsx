import React, { useEffect, useState } from 'react';
import './commentsList.css'; // Ensure you have the necessary CSS for styling
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from "timeago.js";

import { VscSend } from "react-icons/vsc";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Swal from "sweetalert2";
import { MdDeleteOutline } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import axiosInstance from '../../utils/axiosInstance'
import { baseUrl } from '../../utils/baseUrl';
import CommentSpinner from '../spinner/CommentSpinner/CommentSpinner'
import { setIsNotAuthenticated } from '../../redux/user/user'

const CommentsList = ({id, type}) => {

  const userId1 = useSelector((state) => state.user.userData);
  const userId = userId1._id;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socketId = useSelector(state => state.socketId.value);

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [key, setKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const [showReplyInput, setShowReplyInput] = useState(false)

  const handleReplyClick = (userName, commentId) => {
    setShowReplyInput(!showReplyInput);
    setReplyTo(commentId)
    setCommentText('')
    setReplyText('')
    setReplyText(`@${userName} `);
  };


  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get(
          `/user/get-post?postId=${id}`
        );
        if (!response.data) {
          throw new Error("Failed to fetch post");
        }
        setPost(response.data);
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

    fetchPostData();
    setKey(false);
  }, [id, key]);

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") {
      return;
    }
  
    socketId.emit('commentSubmit', { postId: id, text: commentText.trim(), userId });
  
    setCommentText("");
    setKey(true);
    
  };

  const handleReplySubmit = () => {
    if (replyText.trim() === "") {
      return;
    }
  
    socketId.emit('replySubmit', { postId: id, commentId: replyTo, text: replyText.trim(), userId });
    setShowReplyInput(false)
    setReplyText("");
    setReplyTo(null);
    setKey(true);
  };

  const handleDeleteComment = async (commentId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this comment. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      // socketId.emit('deleteComment', { postId: postData1._id, commentId, userId });
      // setKey(true);
      try {
        const response = await axiosInstance.delete(
          `/user/delete-comment?commentId=${commentId}&postId=${id}`,
          { data: { userId } }
        );

        if (!response.data) {
          throw new Error("Failed to delete comment");
        }
        setKey(true);
      } catch (error) {
        if (error.message === 'Refresh token expired') {
          dispatch(setIsNotAuthenticated())
          navigate('/login')
        } else {
          console.error(error);
        }
      }
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this reply. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/user/delete-reply?commentId=${commentId}&replyId=${replyId}&postId=${id}`,
          { data: { userId } }
        );

        if (!response.data) {
          throw new Error("Failed to delete reply");
        }
        setKey(true);
      } catch (error) {
        if (error.message === 'Refresh token expired') {
          dispatch(setIsNotAuthenticated())
          navigate('/login')
        } else {
          console.error(error);
        }
      }
    }
  };

  return (
    <>
      <div className={type === 'popup' ? 'comments-container-popup':'comments-container'}>
        <ul id="comments-list" className="comments-list">
          {isLoading ? (
            Array.from({ length: 5 }, (_, index) => (
              <CommentSpinner key={index} />
            ))
          ) : (
            post &&
            post.comments.map((comment) => (
              <li key={comment._id}>
                <div className="comment-main-level">
                  {/* Avatar */}
                  <div className="comment-avatar">
                    <img src={`${baseUrl}/img/${comment.user.profilePicture}`} />
                  </div>
                  {/* Contenedor del Comentario */}
                  <div className="comment-box">
                    <div className="comment-head">
                      <h6 className="comment-name">
                        {comment.user.firstName} {comment.user.lastName}
                      </h6>
                      <span>{format(comment.createdAt)}</span>
                      {/* Change here */}
                      <div style={{textAlign:'end'}}>
                        <button
                          style={{ fontSize: '0.8em', border: 'none', background: 'none', cursor: 'pointer', color:'black' }}
                          onClick={() => handleReplyClick(`${comment.user.firstName} ${comment.user.lastName}`, comment._id)}
                          >
                          Reply
                        </button>
                        {
                          (comment.user._id === userId || post.userId._id === userId) && (
                            <MdDelete onClick={() => handleDeleteComment(comment._id)} />
                          )
                        }
                      </div>
                      {/* Change ends here */}
                      <i className="fa fa-heart"></i>
                    </div>
                    <div className="comment-content">{comment.text}</div>
                  </div>
                </div>
                {/* Respuestas de los comentarios */}
                {comment.replies && (
                  <ul className={`comments-list reply-list`}>
                    {comment.replies.map((reply) => (
                      <li key={reply._id}>
                        {/* Avatar */}
                        <div className="comment-avatar">
                          <img src={`${baseUrl}/img/${reply.user.profilePicture}`} />
                        </div>
                        {/* Contenedor del Comentario */}
                        <div className="comment-box">
                          <div className="comment-head">
                            <h6 className="comment-name">
                              {reply.user.firstName} {reply.user.lastName}
                            </h6>
                            <span>{format(reply.createdAt)}</span>
                            {
                              (reply.user._id === userId || post.userId._id === userId) && (
                                <div style={{ textAlign: 'end' }}>
                                  <MdDelete onClick={()=>handleDeleteReply(comment._id, reply._id)} />
                                </div>
                              )
                            }             
                          </div>
                          <div className="comment-content">{reply.text}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
  
      <hr />
  
      {/* Add conditional rendering for reply input field */}
      {showReplyInput ? (
        // Render the reply input field
        <div
          style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-around',
            position: 'static',
          }}
        >
          <img
            src={`${baseUrl}/img/${userId1.profilePicture}`}
            alt="Your Image"
            style={{ borderRadius: '50%', height: '50px', width: '50px' }}
          />
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <Input
              onChange={(e) => setReplyText(e.target.value)}
              value={replyText}
              sx={{ color: 'grey' }}
              placeholder="Add a reply"
            />
          </Box>
          <div>
            <VscSend
              onClick={() => handleReplySubmit()}
              style={{ fontSize: '1.5rem', margin: 'auto', color: 'grey' }}
            />
          </div>
        </div>
      ) : (
        // Render the comment input field
        <div
          style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-around',
            position: 'static',
          }}
        >
          <img
            src={`${baseUrl}/img/${userId1.profilePicture}`}
            alt="Your Image"
            style={{ borderRadius: '50%', height: '50px', width: '50px' }}
          />
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <Input
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
              sx={{ color: 'grey' }}
              placeholder="Add a comment"
            />
          </Box>
          <div>
            <VscSend
              onClick={() => handleCommentSubmit()}
              style={{ fontSize: '1.5rem', margin: 'auto', color: 'grey' }}
            />
          </div>
        </div>
      )}
    </>
  );
  
};

export default CommentsList;
