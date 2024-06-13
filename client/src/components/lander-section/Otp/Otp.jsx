import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./otp.css";

import { baseUrl } from "../../../utils/baseUrl";
import { successMessage } from "../../../utils/toaster";

const Otp = ({ role }) => {
  const [countdown, setCountdown] = useState(60);
  const [otpValue, setOtpValue] = useState(Array(6).fill(''));
  const [message, setMessage] = useState("");
  const [resetCounter, setResetCounter] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [resetCounter]);

  const inputRefs = useRef([]);
  const digitValidate = (ele) => {
    ele.value = ele.value.replace(/[^0-9]/g, '');
  };

  const tabChange = (e, index) => {
    const key = e.key;
    if (key === 'Backspace') {
      if (index > 0 && otpValue[index] === '') {
        inputRefs.current[index - 1].focus();
      }
    } else {
      if (inputRefs.current[index].value !== '') {
        if (index < 5) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  const handleChange = (e, index) => {
    digitValidate(e.target);
    const newOtpValue = [...otpValue];
    newOtpValue[index] = e.target.value;
    setOtpValue(newOtpValue);
  };

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleResendClick = () => {
    setOtpValue(Array(6).fill(''));
    setCountdown(60);

    if (resetCounter === true) {
      setResetCounter(false);
    } else {
      setResetCounter(true);
    }

    if (role === "signup") {
      try {
        const registerToken = localStorage.getItem("registerToken");
        fetch(`${baseUrl}/user/resendOtp`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registerToken }),
        });
      } catch (error) {
        console.error("Error signing up:", error.message);
      }
    }

    if (role === "forgetpassword") {
      try {
        const forgetToken = localStorage.getItem("forgetEmailToken");
        fetch(`${baseUrl}/user/forget-password-resend-otp`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ forgetToken }),
        });
      } catch (error) {
        console.error("Error signing up:", error.message);
      }
    }
  };

  const handleSubmit = () => {
    const enteredOtp = parseInt(otpValue.join(""));
    const inputOtp = otpValue.join(""); 

    if(inputOtp.length < 6){
      return
    }

    if (role === "signup") {
      try {
        const registerToken = localStorage.getItem("registerToken");
        fetch(`${baseUrl}/user/otp`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enteredOtp, registerToken }),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.message === "errorOtp") {
              setMessage("Invalid OTP");
            }
            if (res.message === "success") {
              setMessage("");
              localStorage.removeItem("registerToken");
              successMessage("User Successfully Registered");
              navigate("/login");
            }
          });
      } catch (error) {
        console.error("Error signing up:", error.message);
      }
    }

    if (role === "forgetpassword") {
      try {
        const forgetToken = localStorage.getItem("forgetEmailToken");
        fetch(`${baseUrl}/user/forget-password-otp`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enteredOtp, forgetToken }),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.message === "errorOtp") {
              setMessage("Invalid OTP");
            }
            if (res.message === "OTP veryfied") {
              setMessage("");
              navigate("/new-password");
            }
          });
      } catch (error) {
        console.error("Error signing up:", error.message);
      }
    }
  };

  return (
    <div className="container-fluid bg-body-tertiary d-block">
      <div
        style={{ height: "100vh", backgroundColor: "black" }}
        className="row justify-content-center"
      >
        <div className="col-12 col-md-6 col-lg-4">
          <div
            className="card mb-5 mt-5 border-0"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              padding: "40px",
              backgroundColor: "#252525",
              borderRadius: "10px 40px 10px 30px",
            }}
          >
            <div className="card-body p-5 text-center">
              <h4 style={{color:'white'}}>Verify</h4>
              <p style={{color:'white'}}>Your code was sent to you via email</p>
              <span
                style={{
                  color: "red",
                  display: "inline-block",
                  marginBottom: "10px",
                }}
              >
                {message}
              </span>

              <div className="otp-container">
                <form className="otp-form">
                  {otpValue.map((val, index) => (
                    <input
                      key={index}
                      type="text"
                      className="otp-input"
                      value={val}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => tabChange(e, index)}
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </form>
              </div>

              <button
                type="button"
                style={{
                  backgroundColor: "#1e1e1e",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
                onClick={handleSubmit}
                disabled={otpValue.length !== 6}
              >
                Verify
              </button>

              {countdown !== 0 && (
                <p style={{color:'white'}} id="resendText" className="resend mb-0">
                  Resend code in <span id="timer" style={{color:'white'}}>{countdown}</span> seconds
                </p>
              )}
              <p
                id="resendLink"
                style={{ display: countdown === 0 ? "block" : "none", color:'white' }}
                className="resend text-muted mb-0"
              >
                Didn't receive code?{" "}
                <p
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={handleResendClick}
                >
                  Request again
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
