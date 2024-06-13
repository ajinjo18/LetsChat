import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import{ baseUrl } from '../../../utils/baseUrl'
import{ errorMessage } from '../../../utils/toaster'


const ForgetPassword = () => {

  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  const verify =  (e) => {
    e.preventDefault()
    if(email){
      fetch(`${baseUrl}/user/forget-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      })
      .then(response => response.json())
      .then(res => {
        if(res.message === 'Invalid User'){
          errorMessage('Invalid User')
        }
        if(res.message === 'User Exist'){
          localStorage.setItem('forgetEmailToken',res.token)
          setEmail('')
          navigate('/otp-forgetpassword')
        }
      })
    }
  }
    
  return (
    <div className="container d-flex justify-content-center">
      <div style={{marginTop:'30px'}} className="row">
        <div>
          <div className="panel col-12 panel-default" style={{boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding:'40px', backgroundColor:'#252525', borderRadius:'10px 40px 10px 30px'}}>
            <div className="panel-body">
              <div className="text-center">
                <h3><i style={{color:'white'}} className="fa fa-lock fa-4x"></i></h3>
                <h2 style={{color:'white'}} className="text-center">Forgot Password?</h2>
                <p style={{color:'white'}}>You can reset your password here.</p>
                <div className="panel-body">
                  <form>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                        <input 
                          id="email" 
                          name="email" 
                          placeholder="email address" 
                          className="form-control" 
                          type="email" 
                          onChange={(e) => setEmail(e.target.value)} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              verify();
                            }
                          }} 
                        />
                      </div>
                    </div>
                    <div style={{marginTop:'20px'}} className="form-group">
                      <button className="btn btn-lg btn-primary btn-block" onClick={verify} style={{backgroundColor:'#1e1e1e', border:'none'}}>Reset Password</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
