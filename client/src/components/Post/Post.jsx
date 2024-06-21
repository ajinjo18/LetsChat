import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../PostCard/PostCard';
import axiosInstance from '../../utils/axiosInstance';
import SkeletonPostSpinner from '../spinner/SkeletonPostSpinner/SkeletonPostSpinner'
import { successMessage } from '../../utils/toaster';
import Swal from 'sweetalert2';
import { updateDeletedPostStateTrue } from '../../redux/deletePost/deletePost';
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';
import { removeNewPost } from '../../redux/newPostAdded/newPostAdded';
import { setIsNotAuthenticated } from '../../redux/user/user';

const Post = ({ role, categoryId }) => {

    const navigate = useNavigate()

    const userId1 = useSelector(state => state.user.userData);
    const userId = userId1._id;

    const isNewPost = useSelector(state => state.isNewPostAdded.post);
    const [newPost, setNewPost] = useState(isNewPost)

    useEffect(()=>{
        if(isNewPost){
            setNewPost(isNewPost)
        }
    },[isNewPost])


    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const { id, sharedPostId } = useParams();

    const fetchData = async (skip) => {
        try {
            setIsLoading(true);
            let url = '';

            if (role === 'allPost') {
                url = `/user/home-feeds?skip=${skip}&limit=2`;
            } else if (role === 'myProfile') {
                url = `/user/my-posts?userId=${userId}&skip=${skip}&limit=2`;
            } else if (role === 'userProfile') {
                url = `/user/get-user?id=${id}&skip=${skip}&limit=2`;
            } else if (role === 'singlePost') {
                url = `/user/single-post?id=${sharedPostId}`;
                const response = await axiosInstance.get(url)
                setData(response.data);
                console.log(response.data)
                setIsLoading(false);
                setHasMore(false)
                return
            } else if (role === 'savedPosts') {
                const response = await axiosInstance.post(`/user/get-all-saved-posts`,{categoryId})
                setData(response.data.savedPost);
                setIsLoading(false);
                setHasMore(false)
                return
            }

            const response = await axiosInstance.get(url);
            const postData = response.data;
            setData(prevData => [...prevData, ...postData]);
            setHasMore(postData.length > 0);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            if (error.message === 'Refresh token expired') {
                dispatch(setIsNotAuthenticated())
                navigate('/login')
            } else {
                console.error(error);
            }
        }
    };

    const removeSavedPost = async ( postId) => {
        try {
            const response = await axiosInstance.delete('/user/remove-saved-post', {
                data: { categoryId, postId }
            });

            if (response.data.message === 'post removed') {
                setData(prevData => prevData.filter(post => post._id !== postId));
                successMessage('Post removed from category');
            }
        } catch (error) {
            if (error.message === 'Refresh token expired') {
                dispatch(setIsNotAuthenticated())
                navigate('/login')
            } else {
                console.error(error);
            }
        }
    };

    const deletePost = (postId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                  const response = await axiosInstance.delete('/user/delete-post', {
                    data: { postId }
                  });
                            
                    const res = response.data;
                    if (res.message === 'Post deleted successfully') {
                        setData(prevData => prevData.filter(post => post._id !== postId));
                        dispatch(updateDeletedPostStateTrue())
                        dispatch(removeNewPost())
                        successMessage('Post deleted successfully');
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

    useEffect(() => {
        console.log('id', id)
        setData([]);
        fetchData(0);
    }, [role, userId, sharedPostId, id]);

    const lastPostElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchData(data.length);
            }
        });
        if (node) {
            observer.current.observe(node);
        }
    }, [isLoading, hasMore, data.length]);


    return (
        <div>
            {
                isNewPost && <PostCard item={isNewPost} role={role} deletePost={deletePost} removeSavedPost={removeSavedPost}/>
            }
            {data.map((item, index) => {
                if (data.length === index + 1) {
                    return <PostCard ref={lastPostElementRef} key={item._id} item={item} role={role} removeSavedPost={removeSavedPost} deletePost={deletePost}/>;
                } else {
                    return <PostCard key={item._id} item={item} role={role} removeSavedPost={removeSavedPost} deletePost={deletePost} />;
                }
            })}
            {isLoading && 
                <>
                    {Array.from({ length: 10 }).map((_, index) => (
                    <div style={{ marginBottom: '20px' }} key={index}>
                        <SkeletonPostSpinner />
                    </div>
                    ))}
                </>
            }
        </div>
    );
};

export default Post;
