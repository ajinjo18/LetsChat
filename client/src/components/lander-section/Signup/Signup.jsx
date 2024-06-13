import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMediaQuery } from "react-responsive";

import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { baseUrl } from "../../../utils/baseUrl";
import { errorMessage } from "../../../utils/toaster";

const Signup = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFirstNameError("first name required");
      return true;
    } else {
      setFirstNameError("");
      return false;
    }
  };

  const validateLastName = () => {
    if (!lastName.trim()) {
      setLastNameError("last name required");
      return true;
    } else {
      setLastNameError("");
      return false;
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Valid email required.");
      return true;
    } else {
      setEmailError("");
      return false;
    }
  };

  const validatePassword = () => {
    const trimmedPassword = password.trim();
    if (trimmedPassword.includes(" ") || trimmedPassword.length < 6) {
      setPasswordError("Use a strong password");
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  };

  const validateConfirmPassword = () => {
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    if (trimmedPassword !== trimmedConfirmPassword || trimmedPassword === "") {
      setConfirmPasswordError("Passwords do not match");
      return true;
    } else {
      setConfirmPasswordError("");
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const vfn = validateFirstName();
    const vln = validateLastName();
    const ve = validateEmail();
    const vpwd = validatePassword();
    const vcpwd = validateConfirmPassword();

    if (!vfn && !vln && !ve && !vpwd && !vcpwd) {
      const data = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      const register = async () => {
        try {
          fetch(`${baseUrl}/user/register`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.message === "user not exist") {
                const registerToken = res.token;
                localStorage.setItem("registerToken", registerToken);
                navigate("/otp-signup");
              }
              if (res.message === "user alredy exist") {
                errorMessage("User Alredy Exist");
                console.log("user alredy exist");
              }
            });
        } catch (error) {
          console.error("Error signing up:", error.message);
        }
      };

      register();
    } else {
      console.log("validation error");
    }
  };

  if (isMobile) {
    return (
      <div
        style={{
          backgroundColor: "black",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
          padding: "0px 20px 20px 0px",
        }}
      >
        <div
          className="col-12"
          style={{
            background: "#252525",
            padding: "20px",
            textAlign: "start",
            marginLeft: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px 40px 10px 30px",
          }}
        >
          <h3 style={{ marginBottom: "30px" }}>SIGNUP</h3>
          <Row className="g-2">
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="First name">
                <Form.Control
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={validateFirstName}
                />
              </FloatingLabel>
              <span style={{ color: "grey", display: "inline-block" }}>
                {firstNameError}
              </span>
            </Col>
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="Last name">
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={validateLastName}
                />
              </FloatingLabel>
              <span style={{ color: "grey", display: "inline-block" }}>
                {lastNameError}
              </span>
            </Col>
            <FloatingLabel controlId="floatingInputGrid" label="Email">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
              <span style={{ color: "grey", display: "inline-block" }}>
                {emailError}
              </span>
            </FloatingLabel>
            <FloatingLabel controlId="floatingInputGrid" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
              />
              <span style={{ color: "grey", display: "inline-block" }}>
                {passwordError}
              </span>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInputGrid"
              label="Confirm password"
            >
              <Form.Control
                type="password"
                placeholder="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateConfirmPassword}
              />
              <span style={{ color: "grey", display: "inline-block" }}>
                {confirmPasswordError}
              </span>
            </FloatingLabel>
          </Row>
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={handleSubmit}
              style={{
                width: "40%",
                backgroundColor: "#1e1e1e",
                border: "none",
              }}
            >
              Signup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <div
        className="col-6"
        style={{ backgroundColor: "black", textAlign: "start" }}
      >
        <h1 style={{ color: "grey", fontSize: "5em" }}>LET'S CHAT !</h1>
        <marquee behavior="" direction="right">
          <h6
            style={{
              backgroundImage: "linear-gradient(to right, #ff7e5f, #feb47b)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: "1.2em",
            }}
          >
            Connect with friends and the world around you on LET'S CHAT
          </h6>
        </marquee>
      </div>

      <div
        className="col-4"
        style={{
          background: "#252525",
          padding: "20px",
          textAlign: "start",
          marginLeft: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px 40px 10px 30px",
        }}
      >
        <h3 style={{ marginBottom: "30px" }}>SIGNUP</h3>
        <Row className="g-2">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="First name">
              <Form.Control
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={validateFirstName}
              />
            </FloatingLabel>
            <span style={{ color: "black", display: "inline-block" }}>
              {firstNameError}
            </span>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Last name">
              <Form.Control
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={validateLastName}
              />
            </FloatingLabel>
            <span style={{ color: "black", display: "inline-block" }}>
              {lastNameError}
            </span>
          </Col>
          <FloatingLabel controlId="floatingInputGrid" label="Email">
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
            <span style={{ color: "black", display: "inline-block" }}>
              {emailError}
            </span>
          </FloatingLabel>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
              />
            </FloatingLabel>
            <span style={{ color: "black", display: "inline-block" }}>
              {passwordError}
            </span>
          </Col>
          <Col md>
            <FloatingLabel
              controlId="floatingInputGrid"
              label="Confirm password"
            >
              <Form.Control
                type="password"
                placeholder="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateConfirmPassword}
              />
            </FloatingLabel>
            <span style={{ color: "black", display: "inline-block" }}>
              {confirmPasswordError}
            </span>
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={handleSubmit}
            style={{ width: "40%", backgroundColor: "#1e1e1e", border: "none" }}
          >
            Signup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
