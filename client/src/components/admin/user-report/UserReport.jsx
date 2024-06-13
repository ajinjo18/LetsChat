import React, { useEffect, useState } from "react";
import { baseUrl } from '../../../utils/baseUrl';

import Swal from 'sweetalert2';
import { useSelector } from 'react-redux'

import { MdOutlineCancel } from "react-icons/md";
import { MdBlock } from 'react-icons/md';

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import DataTable from "react-data-table-component";
import {darkMode, lightMode} from '../../../utils/themeConfig'
import { successMessage, errorMessage } from "../../../utils/toaster";

const UserReport = () => {
    const theme = useSelector(state => state.adminTheme.value)

    const [colorMode, setColorMode] = useState(theme)
  
  
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
              fetch(`${baseUrl}/admin/reject-report-user?reportId=${reportId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .then(response => response.json())
              .then(res => {
                  if(res.message === 'The report has been rejected'){
                      successMessage('The report has been rejected')
                  }
              })
          }
      });
  };
  
    const handleBlock = (reportId, reportedUser) => {
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, block it!'
      }).then((result) => {
          if (result.isConfirmed) {
              try {
                  fetch(`${baseUrl}/admin/block-reported-user?reportedUser=${reportedUser}&reportId=${reportId}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  })
                  .then(response => response.json())
                  .then(res => {
                      if(res.message === 'User blocked successfully'){
                          successMessage('User blocked successfully')
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
            name: "UserId",
            selector: (row) => row.userId,
        },
        {
            name: "Reported UserId",
            selector: (row) => row.reportedUser,
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
                          <MdBlock onClick={() => handleBlock(row._id, row.reportedUser)} style={{ color: 'red', fontSize: '3em' }} />
                          <MdOutlineCancel onClick={() => handleReject(row._id)} style={{ color: 'green', fontSize: '3em' }} />
                      </>
                  );
              } else if (row.status === "rejected") {
                  return <span>Rejected</span>;
              } else if (row.status === "blocked") {
                  return <span>blocked</span>;
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
          fetch(`${baseUrl}/admin/reported-user`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
          })
          .then(response => response.json())
          .then(res =>{
              console.log(res);
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
      }, [data, successMessage, errorMessage]);
  
  
     
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

export default UserReport
