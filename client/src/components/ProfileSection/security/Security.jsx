import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { errorMessage, successMessage } from "../../../utils/toaster";
import axiosInstance from "../../../utils/axiosInstance";
import { setIsNotAuthenticated } from "../../../redux/user/user";


const Security = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setcurrentPasswordError] = useState("");

  const validatePassword = () => {
    const trimmedPassword = password.trim();
    if (trimmedPassword.includes(" ") || trimmedPassword.length < 6) {
      setPasswordError(
        "Use a strong password without spaces and at least 6 characters"
      );
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  };

  const validateConfirmPassword = () => {
    if (currentPassword.length == "") {
      setcurrentPasswordError("Required");
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  };


  const changePassword = () => {
    const vpwd = validatePassword();
    const vcpwd = validateConfirmPassword();

    if (!vpwd && !vcpwd) {
      axiosInstance
        .patch("/user/update-password", {
          password,
          currentPassword,
        })
        .then((response) => {
          const res = response.data;
          if (res.message === "Invalid Password") {
            errorMessage("Invalid Password");
          } else if (res.message === "Password updated successfully") {
            successMessage("Password updated successfully");
            setPassword("");
            setPasswordError("");
            setCurrentPassword("");
            setcurrentPasswordError("");
          }
        })
        .catch((error) => {
          if (error.message === 'Refresh token expired') {
            dispatch(setIsNotAuthenticated())
            navigate('/login')
          } else {
              console.error(error);
          }
        });
    } else {
      console.log("Validation error");
    }
  };

  return (
    <div
      className='border border-light-subtle'
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "15px",
        marginBottom: "10px",
      }}
    >
      <div style={{textAlign:'center'}}>
        <h3>Security</h3>
      </div>
      <div style={{ textAlign: "start" }}>
        <Row style={{ width: "100%", marginTop: "80px" }}>
          <Form.Label column lg={4}>
            New Password
          </Form.Label>
          <Col>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              value={password}
            />
            <span style={{ color: "grey", display: "inline-block" }}>
              {passwordError}
            </span>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "100%" }}>
          <Form.Label column lg={4}>
            Current Password
          </Form.Label>
          <Col>
            <Form.Control
              type="password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              value={currentPassword}
            />
            <span style={{ color: "grey", display: "inline-block" }}>
              {currentPasswordError}
            </span>
          </Col>
        </Row>
      </div>
      <div style={{textAlign:'center'}}>
        <Button
          variant="primary"
          onClick={changePassword}
          style={{ marginTop: "50px" }}
        >
          Change
        </Button>
      </div>
    </div>
  );
};

export default Security;
