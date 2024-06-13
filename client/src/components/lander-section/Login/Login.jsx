import React, { useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';

import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUser } from '../../../redux/user/user'

import GoogleLoginComponent from '../GoogleLogin/GoogleLoginComponent';
// import CircleSpinner from '../../spinner/CircleSpinner/CircleSpinner';


const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, loading } = useSelector(state => state.user);

  const isMobile = useMediaQuery({ maxWidth: 767 })

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('');

  const submitLogin = (e) => {

    e.preventDefault();

    if(!email){
        return setEmailError("Can't be empty")
    }
    else{
        setEmailError('')
    }

    if(!password){
        return setPasswordError("Can't be empty")
    }
    else{
        setPasswordError('')
    }
    
    dispatch(fetchUser({ email, password }));
    
  }

  // if (loading) {
  //   return <CircleSpinner />;
  // }

  if(isAuthenticated){
    return <Navigate to="/" />
  }


  if(isMobile){
      return (
        <div style={{ backgroundColor: 'black', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'20px', padding:'0px 20px 20px 0px' }}>
            <div className='col-12' style={{ background: '#252525', padding: '20px', textAlign: 'center', marginLeft: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius:'10px 40px 10px 30px' }}>
            <h3 style={{marginBottom:'30px'}}>LOGIN</h3>
                <div style={{textAlign:'start'}}>
                  <Form.Floating className="mb-3" style={{marginTop:'20px'}}>
                      <Form.Control
                      id="floatingInputCustom"
                      type="email"
                      placeholder="name@example.com"
                      value={email}  onChange={(e) => setEmail(e.target.value)}
                      />
                      <label htmlFor="floatingInputCustom">Email address</label>
                      <span style={{ color: 'grey', display: 'inline-block' }}>{emailError}</span>

                  </Form.Floating>
                  <Form.Floating>
                      <Form.Control
                      id="floatingPasswordCustom"
                      type="password"
                      placeholder="Password"
                      value={password}  onChange={(e) => setPassword(e.target.value)}
                      />
                      <label htmlFor="floatingPasswordCustom">Password</label>
                      <span style={{ color: 'grey', display: 'inline-block' }}>{passwordError}</span>

                  </Form.Floating>
                </div>
                <Button onClick={submitLogin} style={{marginTop:'20px', width:'80%', backgroundColor:'#1e1e1e', border:'none'}}>LOGIN</Button><br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
                  <GoogleLoginComponent />
                </div>
                <Button onClick={()=>navigate('/forgetpassword')} variant='primary' style={{marginTop:'15px', color:'white', backgroundColor:'transparent', border:'none'}}>Forget password ?</Button>
            </div>
        </div>
    
      )
  }

  return (
    <div style={{ backgroundColor: 'black', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'20px'}}>
      <div className='col-6' style={{ backgroundColor: 'black', textAlign: 'start' }}>
        <h1 style={{ color: 'grey',fontSize:'5em' }}>LET'S CHAT !</h1>
        <marquee behavior="" direction="right">
              <h6 style={{ 
              backgroundImage: 'linear-gradient(to right, #ff7e5f, #feb47b)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: '1.2em' 
          }}>Connect with friends and the world around you on LET'S CHAT</h6>
        </marquee>   
      </div>

      <div className='col-4' style={{ background: '#252525', padding: '20px', textAlign: 'start', marginLeft: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius:'10px 40px 10px 30px' }}>
        <h3 style={{marginBottom:'30px'}}>LOGIN</h3>
        <Form.Floating className="mb-3" style={{marginTop:'20px'}}>
          <Form.Control
          id="floatingInputCustom"
          type="email"
          placeholder="name@example.com"
          value={email}  onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingInputCustom">Email address</label>
        <span style={{ color: 'grey', display: 'inline-block' }}>{emailError}</span>
        </Form.Floating>

        <Form.Floating>
          <Form.Control
          id="floatingPasswordCustom"
          type="password"
          placeholder="Password"
          value={password}  onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPasswordCustom">Password</label>
          <span style={{ color: 'grey', display: 'inline-block' }}>{passwordError}</span>
        </Form.Floating>

        <div style={{textAlign:'center'}}>
          <Button onClick={submitLogin} style={{marginTop:'20px', width:'50%', backgroundColor:'#1e1e1e', border:'none'}}>LOGIN</Button><br />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
            <GoogleLoginComponent />
          </div>
          <Button onClick={()=>navigate('/forgetpassword')} variant='primary' style={{marginTop:'10px', color:'whitesmoke', backgroundColor:'transparent', border:'none'}}>Forget password ?</Button><br />
        </div>
      </div>
    </div>
  )
   
}

export default Login
