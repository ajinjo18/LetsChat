import React, { useEffect, useState } from "react";
import { baseUrl } from '../../../utils/baseUrl';

import Swal from 'sweetalert2';
import { useSelector } from 'react-redux'

import { MdDelete } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import DataTable from "react-data-table-component";
import {darkMode, lightMode} from '../../../utils/themeConfig'
import { successMessage } from "../../../utils/toaster";



const PostReport = () => {

  const theme = useSelector(state => state.adminTheme.value)

  const [colorMode, setColorMode] = useState(theme)
  const [key, updatekey] = useState(false)


  useEffect(()=>{
      if(theme === 'darkMode'){
          setColorMode(darkMode)
      }
      else{
          setColorMode(lightMode)
      }
  },[theme])

  const handleReject = (reportId) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to reject this report?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${baseUrl}/admin/reject-report?reportId=${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(res => {
                if(res.message === 'The report has been rejected'){
                    updatekey(true)
                    successMessage('The report has been rejected')
                }
            })
        }
    });
};

  const handleDelete = (reportId, postId) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                fetch(`${baseUrl}/admin/delete-post?postId=${postId}&reportId=${reportId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(res => {
                    if(res.message === 'Post deleted successfully'){
                        updatekey(true)
                        successMessage('Post deleted successfully')
                    }
                })
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    });
};


  const [selectedReason, setSelectedReason] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);

  const toggleReasonModal = () => setShowReasonModal(!showReasonModal);

  const columns = [
      {
          name: "Date",
          selector: (row) => new Date(row.createdAt).toDateString(),
      },
      {
          name: "User",
          selector: (row) => row.userId.firstName+' '+row.userId.lastName,
      },
      {
          name: "Post",
          cell: (row) => (
            row.postId && row.postId.images && row.postId.images.length > 0 && (
              <img 
                src={`${baseUrl}/img/${row.postId.images[0]}`} 
                alt="Post" 
                style={{ width: '100px', height: 'auto', padding:'5px' }}
              />
            )
          )
      },
      {
          name: "Reason",
          cell: (row) => (
              <Button variant="link" onClick={() => {
                  setSelectedReason(row.reason);
                  toggleReasonModal();
              }}>Show</Button>
          ),
          button: true,
      },
      {
        name: "Actions",
        cell: (row) => {
            if (row.status === "pending") {
                return (
                    <>
                        <MdDelete onClick={() => handleDelete(row._id, row.postId._id)} style={{ color: 'red', fontSize: '3em' }} />
                        <MdOutlineCancel onClick={() => handleReject(row._id)} style={{ color: 'green', fontSize: '3em' }} />
                    </>
                );
            } else if (row.status === "rejected") {
                return <span>Rejected</span>;
            } else if (row.status === "deleted") {
                return <span>Deleted</span>;
            }
            return null;
        },
        button: true,
    },
  ];

    const [data, setData]= useState([]);
    const [search, SetSearch]= useState('');
    const [filter, setFilter]= useState([]);

    const getData = ()=>{
    
      try{
        fetch(`${baseUrl}/admin/reported-post`, {
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(res =>{
            console.log(res)
            updatekey(false)
          setData(res)
          setFilter(res);
        })
        
      } 
      catch(error){
        console.log(error);
      }
    }

    useEffect(()=>{
        getData();
    }, [ key]);


   
  const tableHeaderStyle = {
        rows: {
            style: {
                backgroundColor: colorMode.bodyBackground,
                color: colorMode.text
            }
        },
        headCells: {
            style: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: colorMode.cardBackground,
                color: colorMode.text
            }
        },
        pagination: {
            style: {
                backgroundColor: colorMode.bodyBackground,
                color: colorMode.text
            }
        },
        subHeader: {
            style: {
                backgroundColor: colorMode.bodyBackground,
                color: colorMode.text
            }
        }
    };


    return (
        <>
            <DataTable
                responsive={true}
                customStyles={tableHeaderStyle}
                columns={columns}
                data={filter}
                pagination
                fixedHeader
                selectableRowsHighlight
                highlightOnHover
                fixedHeaderScrollHeight="50vh"
            />
            <Modal show={showReasonModal} onHide={toggleReasonModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reason</Modal.Title>
                </Modal.Header>
                <Modal.Body>{selectedReason}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleReasonModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default PostReport;
