import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { GoBookmark } from "react-icons/go";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import {baseUrl} from '../../utils/baseUrl'
import axiosInstance from '../../utils/axiosInstance'
import {errorMessage, successMessage} from '../../utils/toaster'
import CommentSpinner from '../spinner/CommentSpinner/CommentSpinner'
import { setIsNotAuthenticated } from '../../redux/user/user';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


function SimpleDialog(props) {
  const { onClose, open, id } = props;

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [category, setCategory] = useState('')
  const [categoryData, setCategoryData] = useState('')
  const [key, updateKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    onClose();
  };

  useEffect(()=>{
    try {
      const fetchData = async() => {
        setIsLoading(true)
        const response = await axiosInstance.get(`${baseUrl}/user/get-bookmarks`)
        setCategoryData(response.data)
        setIsLoading(false)
      }
      fetchData()
      updateKey(false)
    } catch (error) {
      setIsLoading(false)
      if (error.message === 'Refresh token expired') {
        dispatch(setIsNotAuthenticated())
        navigate('/login')
      } else {
          console.error(error);
      }
    }

  },[key, id, open])

 

  const handleListItemClick = async(value) => {
    const postId = id
    const categoryId = value
    const response = await axiosInstance.post(`${baseUrl}/user/save-post`,{postId, categoryId})
    if(response.data.message === 'Post successfully added to saved posts'){
      updateKey(true)
      successMessage('Post successfully added to saved posts')
    }
    if(response.data.message === 'Post already exists in saved posts'){
      errorMessage('Post already exists in saved posts')
    }
    onClose();
  };

  const savecategory = async() => {
    if(category.trim() === ''){
      return
    }
    const response = await axiosInstance.post(`${baseUrl}/user/add-category`,{category})
    setCategory('')
    if(response.data.message === 'category added'){
      setCategory('')
      updateKey(true)
      successMessage('category added')
    }
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select Category</DialogTitle>
      <List sx={{ pt: 0 }}>
        {
          isLoading ? (
            Array.from({ length: 5 }, (_, index) => (
              <CommentSpinner key={index} />
            ))
          ) : (
            categoryData && categoryData.map((item) => (
              <ListItem disableGutters key={item._id}>
                <ListItemButton onClick={() => handleListItemClick(item._id)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      {
                        item.savedPost[item.savedPost.length-1]?.images[0] ? (
                          <img style={{width:'50px', height:'50px', borderRadius:'50%'}} src={`${baseUrl}/img/${item.savedPost[item.savedPost.length-1]?.images[0]}`} />
                        ) : (
                          <PersonIcon />
                        )
                      }
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))
          )
        }
        <ListItem disableGutters>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Add New Category
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField value={category} onChange={(e)=>setCategory(e.target.value)} id="outlined-basic" label="New Category" variant="outlined" />
                </Box>
                <div style={{textAlign:'center'}}>
                  <Button onClick={savecategory} variant="contained">Save</Button>
                </div>
              </AccordionDetails>
            </Accordion>
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function ListSavedCategory({id}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <GoBookmark style={{fontSize: '1.5em'}} variant="outlined" onClick={handleClickOpen} />
      <SimpleDialog
        id={id}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
