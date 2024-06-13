import React, { useEffect, useState } from 'react'
import { CgMoreR } from "react-icons/cg";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';

import { baseUrl } from '../../../utils/baseUrl';
import axiosInstance from '../../../utils/axiosInstance';
import SquareSpinner from '../../spinner/SquareSpinner/SquareSpinner';
import PersonIcon from '@mui/icons-material/Person';
import Post from '../../Post/Post';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { successMessage } from '../../../utils/toaster';
import { setIsNotAuthenticated } from '../../../redux/user/user';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const SavedPosts = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [savedCategories, setSavedCategories] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [key, updateKey] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState('');
    const [categoryId, setCategoryId] = useState('')

    const [selectedData, setSelectedData] = useState('')
    const [categoryName, setCategoryName] = useState('')

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setCategoryName(selectedData.name)
        setShow(false)
    }
    const handleShow = () => setShow(true);

    useEffect(()=>{
        try {
          const fetchData = async() => {
            setIsLoading(true)
            const response = await axiosInstance.get('/user/get-bookmarks')
            setSavedCategories(response.data)
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
    
      },[key])

    const handleUserClick = async(user) => {
        if (selectedUsers === user._id ) {
            setSelectedUsers('');
            setCategoryId('')
            setSelectedData('')
            setCategoryName('')
            handleClose()
        } 
        else {
            setSelectedUsers('');
            setCategoryId('')
            setSelectedData('')
            setCategoryName('')
            handleClose()
            setTimeout(() => {
                setSelectedUsers(user._id);
                setCategoryId(user._id);
                setSelectedData(user)
                setCategoryName(user.name)
            }, 0);
        }
    };

    const editCategory = async() => {
        if(categoryName.trim() === ''){
            return
        }
        const response = await axiosInstance.post('/user/edit-category',{categoryId, categoryName})

        if(response.data.message === 'updated') {
            successMessage('Category Updated')
            setSelectedData(prev => ({
                ...prev,
                name: categoryName
            }));
            updateKey(true)
            handleClose()
        }
    }

    const handleDeleteClick = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "All saved posts will be deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.delete('/user/delete-category', {
                        data: { categoryId }
                    });
    
                    if (response.status === 200) {
                        updateKey(true)
                        setShow(false)
                        setSelectedUsers('');
                        setCategoryId('')
                        setSelectedData('')
                        setCategoryName('')
                        successMessage('All your saved posts have been deleted.');
                    } 
                } catch (error) {
                    if (error.message === 'Refresh token expired') {
                        dispatch(setIsNotAuthenticated())
                        navigate('/login')
                    } else {
                        console.error(error);
                    }
                }
            }
        });
    };


    return (
        <div>
            <div
                className='border border-light-subtle'
                style={{
                    padding: "5px",
                    borderRadius: "15px",
                    marginBottom: "10px",
                    width: "100%",
                }}
            >
                <div style={{textAlign:'center'}}>
                    <h5>Saved Posts</h5>
                </div>

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
                            {savedCategories && savedCategories.map(user => (
                                <>
                                    <div
                                        className='border border-light-subtle'
                                        key={user._id}
                                        onClick={() => handleUserClick(user)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            marginBottom: '25px',
                                            cursor: 'pointer',
                                            border: selectedUsers === user._id ? '1.5px solid blue' : '1px solid gray',
                                            backgroundColor: selectedUsers === user._id ? 'grey' : '',
                                            borderRadius: '8px',
                                            padding: '10px'
                                        }}
                                    >
                                        {
                                            user.savedPost[user.savedPost.length-1]?.images[0] ? (
                                                <img style={{width:'50px', height:'50px', borderRadius:'50%'}} src={`${baseUrl}/img/${user.savedPost[user.savedPost.length-1]?.images[0]}`} />
                                            ) : (
                                                <PersonIcon style={{fontSize:'3.1em', borderRadius:'50%'}} />
                                            )
                                        }
                                        <div style={{ textAlign: 'center', fontSize: '1rem' }}>
                                            {user.name}
                                        </div>
                                    </div>
                                    
                                </>
                            ))}
                        </div>
                    )}
                    
                </div>
        
            </div>
            {
                selectedData && (
                    <div style={{marginBottom:'10px'}}>
                        <p className='border border-light-subtle' style={{ display: 'inline-block', padding: '5px', margin: '0' }}>
                            {selectedData.name}
                            <CgMoreR  onClick={handleShow} style={{marginLeft:'5px'}} />
                        </p>
                    </div>
                
                )
            }
            {
                selectedUsers && categoryId && <Post role={'savedPosts'} categoryId={categoryId} />
            }
            {
                selectedData && (
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Edit Category</Modal.Title>
                        </Modal.Header>
                        <div
                            className='border border-light-subtle'
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginBottom: '25px',
                                borderRadius: '8px',
                                padding: '10px'
                            }}
                        >
                            <div style={{textAlign:'end'}}>
                                <RiDeleteBin6Line style={{cursor: 'pointer', fontSize:'1.5em'}} onClick={handleDeleteClick} />
                            </div>

                            <div style={{textAlign:'center'}}>
                                {
                                    selectedData.savedPost[selectedData.savedPost.length-1]?.images[0] ? (
                                        <img style={{width:'60px', height:'60px', borderRadius:'50%', marginBottom:'5px'}} src={`${baseUrl}/img/${selectedData.savedPost[selectedData.savedPost.length-1]?.images[0]}`} />
                                    ) : (
                                        <PersonIcon style={{fontSize:'3.1em', borderRadius:'50%'}} />
                                    )
                                }
                            </div>
                            
                            <div style={{ textAlign: 'center', fontSize: '1rem' }}>
                                <input type="text" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} />
                            </div>
                        </div>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={editCategory}>Save changes</Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        </div>
    )
}

export default SavedPosts
