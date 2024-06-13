import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { VscSend } from "react-icons/vsc";
import { MdPermMedia } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

import { darkMode, lightMode } from '../../utils/themeConfig'
import {baseUrl} from '../../utils/baseUrl'
import {successMessage} from '../../utils/toaster'
import CropImageMain from '../PostImageCrop/CropImageMain';
import axiosInstance from '../../utils/axiosInstance';
import { setIsNotAuthenticated } from '../../redux/user/user'
import { setNewPost } from '../../redux/newPostAdded/newPostAdded';


const AddPost = () => {

    const userData = useSelector(state => state.user.userData)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        setSelectedImages([])
        setDescription('')
    }

    const handleShow = () => setShow(true);

    const [selectedImages, setSelectedImages] = useState([]);
    const [description, setDescription] = useState('')
    const [descriptionOnly, setDescriptionOnly] = useState('')

    const handleImageSelect = (event) => {
        const files = event.target.files;
        const filesArray = Array.from(files);

        const newImages = filesArray.map((file, index) => ({
            id: Date.now() + index,
            imageUrl: URL.createObjectURL(file),
            croppedImageUrl: null
        }));

        setSelectedImages(prevImages => [...prevImages, ...newImages]);
    };

    const userId1 = useSelector(state => state.user.userData)
    const userId = userId1._id

    const saveDescription = async() => {
        if(descriptionOnly.trim() === ''){
            return
        }
        try {
            const response = await axiosInstance.post('/user/add-post-description', {descriptionOnly});
            dispatch(setNewPost(response.data.post))
            setDescriptionOnly('')
            successMessage('Post added successfully');
        } catch (error) {
            if (error.message === 'Refresh token expired') {
                dispatch(setIsNotAuthenticated())
                navigate('/login')
            } else {
                console.error(error);
            }
        }
    }

    const handleSave = async(croppedImagesData) => {

        const formData = new FormData();
        
        formData.append('description', description);
        
        const promises = croppedImagesData.map(async (imageData, index) => {
            if (imageData.croppedImageUrl) {
                const response = await fetch(imageData.croppedImageUrl);
                const blob = await response.blob();
                formData.append(`image`, blob, `image_${index}.jpg`);
            } else {
                const response = await fetch(imageData.imageUrl);
                const blob = await response.blob();
                formData.append(`image`, blob, `image_${index}.jpg`);
            }
        });
    
        await Promise.all(promises);
    
        try {
            const response = await axiosInstance.post('/user/add-post', formData);
            dispatch(setNewPost(response.data.post))
            successMessage('Post added successfully');
            handleClose();
        } catch (error) {
            if (error.message === 'Refresh token expired') {
                dispatch(setIsNotAuthenticated())
                navigate('/login')
            } else {
                console.error(error);
            }
        }
    };


  return (
    <div
        className='border border-light-subtle'
        style={{
            marginBottom: '20px',
            height: '100px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            padding: '10px'
        }}
        >
        <img
            style={{
            overflow: 'hidden',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            marginRight: '10px'
            }}
            src={`${baseUrl}/img/${userData.profilePicture}`}
            alt=""
        />
        <input
            className='border border-light-subtle'
            placeholder="Share Your Feeds..."
            type="text"
            style={{
            width: '50%',
            flex: 1,
            height: '40px',
            backgroundColor: 'transparent',
            marginLeft: '10px',
            borderRadius: '20px',
            padding: '10px'
            }}
            onChange={(e)=>setDescriptionOnly(e.target.value)}
            value={descriptionOnly}
        />
        <VscSend onClick={saveDescription} style={{ fontSize: '2.5em', color: 'blue' }} />
        <div style={{ display: 'flex', alignItems: 'center', padding:'10px 0 10px 10px' }}>
            <MdPermMedia onClick={handleShow} style={{ fontSize: '2em', color: 'grey', cursor:'pointer' }} />
        </div>

        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
            <Modal.Title>Add Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <textarea placeholder='Share Your Feeds...' onChange={(e)=> setDescription(e.target.value)} style={{ width: '100%', height: '50%' }}></textarea>
            <div style={{ display: 'flex' }}>

                <CropImageMain initData={selectedImages} save={handleSave} />

            </div>
            <div>
                
            </div>
            </Modal.Body>
            <Modal.Footer>
            <div style={{ display: 'flex', marginRight: 'auto' }}>
                <label htmlFor="fileInput">
                    <IoAddCircleOutline size={35} color="blue" /><p>Add</p>
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                />
            </div>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>


    </div>
    
  )
}

export default AddPost
