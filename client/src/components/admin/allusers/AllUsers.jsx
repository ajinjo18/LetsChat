import React, { useEffect, useState } from "react";
import { baseUrl } from '../../../utils/baseUrl';
import { MdBlock } from 'react-icons/md';
import { CgUnblock } from 'react-icons/cg';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux'
import io from 'socket.io-client';


import DataTable from "react-data-table-component";
import {darkMode, lightMode} from '../../../utils/themeConfig'

const socket = io(baseUrl);

const AllUsers = () => {

    const columns= [
        {
            name:"First Name",
            selector:(row)=>row.firstName,
        },
        {
            name:"Last Name",
            selector:(row)=>row.lastName,
        },
        {
            name:"Email",
            selector:(row)=>row.email,
        },
        {
            name:"Action",
            selector:(row)=> row.isBlocked ? (
              <button onClick={() => unblockUser(row._id)} style={{ backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CgUnblock style={{ marginRight: '4px' }} />
                  Unblock
              </button>
            ) : (
              <button onClick={() => blockUser(row._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdBlock style={{ marginRight: '4px' }} />
                  Block
              </button>
          ),
        },

    ];
    const [data, setData]= useState([]);
    const [search, SetSearch]= useState('');
    const [filter, setFilter]= useState([]);

    const getData = async()=>{
    
      try{
        fetch(`${baseUrl}/admin/all-users`, {
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(res =>{
          setData(res.data)
          setFilter(res.data);
        })
        
      } 
      catch(error){
        console.log(error);
      }
    }

    useEffect(()=>{
        getData();
    }, []);

    useEffect(()=>{
        const result= data.filter((item)=>{
         return item.firstName.toLowerCase().match(search.toLocaleLowerCase());
        });
        setFilter(result);
    },[search]);


  const blockUser = (userId) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to block this user',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, block it!'
    }).then((result) => {
        if (result.isConfirmed) {
          fetch(`${baseUrl}/admin/block-user/${userId}`, {
              method: 'post',
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(res => {
            socket.emit('user blocked', { userId })
            setFilter(data.map(user => user._id === userId ? { ...user, isBlocked: true } : user));
              Swal.fire('Blocked!', 'User has been blocked.', 'success');
          })
          .catch(error => {
              console.error('Error blocking user:', error);
              Swal.fire('Error!', 'Failed to block user.', 'error');
          });
        }
    });
  };

  const unblockUser = (userId) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to unblock this user',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, unblock it!'
    }).then((result) => {
        if (result.isConfirmed) {
          fetch(`${baseUrl}/admin/unblock-user/${userId}`, {
              method: 'post',
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(res => {
            setFilter(data.map(user => user._id === userId ? { ...user, isBlocked: false } : user));
              Swal.fire('Unblocked!', 'User has been unblocked.', 'success');
          })
          .catch(error => {
              console.error('Error unblocking user:', error);
              Swal.fire('Error!', 'Failed to unblock user.', 'error');
          });
        }
    });
  };
   


  return(
      <>
          <h6 style={{color:'black'}}>All Users</h6>
          <DataTable 
          responsive={true}
          columns={columns}
          data={filter}
          pagination
          fixedHeader
          selectableRowsHighlight
          highlightOnHover
          fixedHeaderScrollHeight="50vh"


          subHeader
            subHeaderComponent={
              <input type="text"
              className="w-25 form-control"
              placeholder="Search..."
              value={ search}
              onChange={(e)=>SetSearch(e.target.value)}
              />
            }
            subHeaderAlign="right"
          
          />
      </>
  );
}


export default AllUsers;
