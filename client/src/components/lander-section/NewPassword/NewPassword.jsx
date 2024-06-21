import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { baseUrl } from "../../../utils/baseUrl";
import { successMessage } from "../../../utils/toaster";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [passswordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Use a strong password");
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  };

  const submit = () => {
    const vpwd = validatePassword();
    if (!vpwd) {
      const forgetToken = localStorage.getItem("forgetEmailToken");
      fetch(`${baseUrl}/user/new-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, forgetToken }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.message === "Password updated successfully") {
            successMessage("Password updated successfully");
            localStorage.removeItem("forgetEmailToken");
            navigate("/login");
          }
        });
    } else {
      console.log("validation error");
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
              <h4 style={{color:'white'}}>Create new password</h4>

              <Row
                style={{ padding: "10px", marginBottom: "20px" }}
                className="g-2"
              >
                <Col md>
                  <FloatingLabel controlId="floatingInputGrid" label="password">
                    <Form.Control
                      type="password"
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={validatePassword}
                    />
                  </FloatingLabel>
                  <span style={{ color: "red", display: "inline-block" }}>
                    {passswordError}
                  </span>
                </Col>
              </Row>

              <Button
                onClick={submit}
                type="button"
                style={{
                  width: "40%",
                  backgroundColor: "#1e1e1e",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
