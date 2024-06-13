import React,{useEffect, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import axiosInstance from '../../utils/axiosInstance';
import { errorMessage, successMessage } from '../../utils/toaster';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { darkMode, lightMode } from '../../utils/themeConfig';
import { setIsNotAuthenticated } from '../../redux/user/user';
import { useNavigate } from 'react-router-dom';


export default function PostMenu({postId, role, postUserId, deletePost}) {

  const userId1 = useSelector(state => state.user.userData)
  const userId = userId1._id

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null);
  const [showPostReport, setShowPostReport] = useState(false);
  const [PostReport, setPostReport] = useState('');

  const theme = useSelector((state) => state.theme.value);
  const [colorMode, setColorMode] = useState(theme);

  useEffect(() => {
    if (theme === "darkMode") {
      setColorMode(darkMode);
    } else {
      setColorMode(lightMode);
    }
  }, [theme]);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClosePostReport = () => {
        setPostReport('')
        setAnchorEl(null)
        setShowPostReport(false)
    }

    const handleShowPostReport = () => {
        setAnchorEl(null);
        setShowPostReport(true)
    }

  const reportPost = async () => {
    try {
        const response = await axiosInstance.post(`/user/post-report?postId=${postId}`, {reason: PostReport});
        const res = response.data;
        if (res.message === 'Post Reported successfully') {
            successMessage('Post Reported successfully');
        } else if (res.message === 'Post already reported by this user') {
            errorMessage('Post already reported by this user');
        }
        setPostReport('')
        setShowPostReport(false);
    } catch (error) {
      if (error.message === 'Refresh token expired') {
        dispatch(setIsNotAuthenticated())
        navigate('/login')
      } else {
        console.error(error);
      }
    }
  };

  const handleDelete = () => {
    setAnchorEl(null);
    deletePost(postId)
  }

  return (
    <div>
      <IconButton
        style={{color: colorMode.lightText}}
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
            '& .MuiPaper-root': {
              backgroundColor: colorMode.cardBackground,
              color: colorMode.text,
            },
          }}
      >
        {
          postUserId === userId && (
            <MenuItem style={{color: colorMode.text}} onClick={handleDelete}>Delete</MenuItem>
          )
        }
        {
          postUserId !== userId && (
            <MenuItem style={{color: colorMode.text}} onClick={handleShowPostReport}>Report</MenuItem>
          )
        }
      </Menu>
        {
            showPostReport && (
                <Modal
                    show={showPostReport}
                    onHide={handleClosePostReport}
                    backdrop="static"
                    keyboard={false}
                    >
                    <Modal.Header>
                    <Modal.Title>Report Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Reason...</h5>
                        <textarea style={{ width:'100%'}} onChange={(e)=>setPostReport(e.target.value)} value={PostReport}></textarea>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePostReport}>
                        Close
                    </Button>
                    <Button onClick={reportPost} variant="primary">Report</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    </div>
  );
}
