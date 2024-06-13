import React from 'react'

import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const LanderNavbar = () => {

  const navigate = useNavigate()

  return (
    <div style={{paddingTop:'15px',backgroundColor:'black',paddingLeft:'20px',paddingRight:'20px'}}>
        <Navbar collapseOnSelect expand="lg" style={{background: '#252525', borderRadius: '10px 40px 10px 30px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
          <Container>
            <Navbar.Brand><img style={{width:'70px'}} src="/logo.png" alt="" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{backgroundColor:'white'}} />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav>
                <Nav.Link style={{color:'white'}} onClick={()=>navigate('/login')} ><h5>LOGIN</h5></Nav.Link>
                <Nav.Link style={{color:'white'}} onClick={()=>navigate('/signup')} ><h5>SIGNUP</h5></Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </div>
  )
}

export default LanderNavbar
