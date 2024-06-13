import React, { useEffect, useState } from 'react'
import { format } from "timeago.js";

import './AllPosts.css'
import { baseUrl } from '../../../utils/baseUrl';
import ImageCarousel from '../../ImageCarousel/ImageCarousel';
import axios from 'axios';
import CircleSpinner from '../../spinner/CircleSpinner/CircleSpinner';
import { GoBookmark } from 'react-icons/go';
import { FiSend } from 'react-icons/fi';
import { FaRegComment } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';

const AllPosts = () => {

  const [data, setData] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    try {
      const fetchData = async() => {
        setIsLoading(true)
        const response = axios.get(`${baseUrl}/admin/all-posts`)
        setData((await response).data)
        setIsLoading(false)
      }
      fetchData()
    } catch (error) {
      setIsLoading(false)
      console.log(error.message)
    }
  },[])

  if(isLoading) {
    return <CircleSpinner />
  }

  return (
    data && data.map(item => (
        <div style={{color:'black'}} className="app-container" key={item._id}>
            <div className="post-container border border-light-subtle">
                <div style={{ textAlign: 'end' }}>
                    {/* <PostMenu postId={item._id} role={role} postUserId={item.userId._id} deletePost={deletePost}/> */}

                    {/* {
                        userId !== item.userId._id && (
                            <PostMenu postId={item._id} />
                        )
                    } */}
                </div>
                <div className="post-header">
                    <img className="avatar" src={`${baseUrl}/img/${item?.userId?.profilePicture}`} alt="User" />
                    <div className="user-info">
                        <span className="username">{item.userId.firstName} {item.userId.lastName}</span>
                        <span className="time">{format(new Date(item.createdAt), 'PPP')}</span>
                    </div>
                </div>
                {
                    item?.description && (
                        <div style={{ padding: '10px' }}>
                            <p>{item?.description}</p>
                        </div>
                    )
                }
                <div style={{ textAlign: 'center' }}>

                    {/* <div>
                        <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            item={item}
                        />
                    </div> */}

                    {
                        item.images.length === 0 ? null : (
                            item.images.length > 1 ? (
                                <div>
                                    <ImageCarousel images={item.images} />
                                </div>
                            ) : (
                                <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
                                    <img
                                        src={`${baseUrl}/img/${item.images[0]}`}
                                        style={{ maxWidth: '100%', maxHeight: '100%', minHeight: '100%', borderRadius: '5%', padding: '10px' }}
                                        alt="Post"
                                    />
                                </div>
                            )
                        )
                    }
                </div>
                {/* <div className="likes">{likeCount} likes</div> */}
                <div className="post-actions">
                    <div className="left-actions">
                        <CiHeart style={{ fontSize: '1.7em' }} />
                        <FaRegComment style={{ fontSize: '1.5em' }} />
                        <FiSend style={{ fontSize: '1.5em' }} />
                    </div>
                    <div className="right-actions">
                        <GoBookmark style={{ fontSize: '1.5em' }} />
                    </div>
                </div>
            </div>
        </div>
    ))
  );
}

export default AllPosts
