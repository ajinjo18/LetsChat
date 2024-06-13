import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaEdit } from "react-icons/fa";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";


import { baseUrl } from "../../../utils/baseUrl";
import { successMessage, errorMessage } from "../../../utils/toaster";

import {
  setIsNotAuthenticated,
  setIsAuthenticated,
  setLoading,
} from "../../../redux/user/user";

// import SpinnerOne from "../spinner/SpinnerOne";
import axiosInstance from "../../../utils/axiosInstance";
import CircleSpinner from "../../spinner/CircleSpinner/CircleSpinner";

const MyDetails = () => {
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData, loading } = useSelector((state) => state.user);

  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [phone, setPhone] = useState(userData.phone);
  const [dob, setDob] = useState(userData.dob);

  useEffect(() => {
    if (!show) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setPhone(userData.phone);
      setDob(userData.dob);
    }
  }, [show, userData]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const clickUpdate = async () => {
    const logoutFun = () => {
      dispatch(setIsNotAuthenticated());
      navigate("/");
    };

    const data = {};

    if (firstName.trim() !== "") {
      data.firstName = firstName.trim();
    }
    if (lastName.trim() !== "") {
      data.lastName = lastName.trim();
    }
    if (phone !== undefined && phone !== null) {
      data.phone = phone;
    }
    if (dob !== undefined) {
      data.dob = dob;
    }

    if (Object.keys(data).length > 0) {
      try {
        dispatch(setLoading(true));

        const response = await axiosInstance.patch("/user/update", data);

        dispatch(setLoading(false));

        const res = response.data;

        if (res.message === "User data updated successfully") {
          dispatch(setIsAuthenticated(res.updatedUser));
          setShow(false);
          successMessage("Updated Successfully");
        } else if (res.message === "Account Blocked") {
          errorMessage("Account Blocked");
          logoutFun();
        }
      } catch (error) {
        dispatch(setLoading(false));
        if (error.message === 'Refresh token expired') {
          dispatch(setIsNotAuthenticated())
          navigate('/login')
        } else {
          console.error(error);
        }
      }
    } else {
      setShow(false);
    }
  };


  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return <CircleSpinner />;
  }

  return (
    <div
      className='border border-light-subtle'
      style={{
        padding: "5px",
        borderRadius: "15px",
        marginBottom: "10px",
        width: "100%",
      }}
    >
      <div style={{textAlign:'center'}}>
        <h3>My Details</h3>
      </div>
      <div style={{ textAlign: "end", marginTop:'-20px' }}>
        <FaEdit
          onClick={handleShow}
          style={{
            cursor: "pointer",
            fontSize: "1.5em",
            marginRight: "10px",
          }}
        />
      </div>
      <div
        style={{
          display: "block",
          textAlign: "start",
          padding: "20px",
        }}
      >
        <Row style={{ width: "100%" }}>
          <Form.Label column lg={4}>
            First Name
          </Form.Label>
          <Col>
            <Form.Control type="text" readOnly value={userData.firstName} />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "100%" }}>
          <Form.Label column lg={4}>
            Last Name
          </Form.Label>
          <Col>
            <Form.Control type="text" readOnly value={userData.lastName} />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "100%" }}>
          <Form.Label column lg={4}>
            Email
          </Form.Label>
          <Col>
            <Form.Control type="email" readOnly value={userData.email} />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "100%" }}>
          <Form.Label column lg={4}>
            Phone
          </Form.Label>
          <Col>
            <Form.Control
              type="number"
              value={userData.phone}
              readOnly={userData.phone ? true : false}
            />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "100%", paddingBottom: "20px" }}>
          <Form.Label column lg={4}>
            Dob
          </Form.Label>
          <Col>
            <Form.Control
              type="text"
              value={
                userData.dob ? new Date(userData.dob).toLocaleDateString() : ""
              }
              readOnly={userData.dob ? true : false}
            />
          </Col>
        </Row>
      </div>

      <Modal
        show={show}
        onHide={handleClose}>
        <Modal.Header
          closeButton
        >
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body
        >
          <div
            style={{
              display: "block",
              textAlign: "start",
            }}
          >
            <Row style={{ width: "100%" }}>
              <Form.Label column lg={4}>
                First Name
              </Form.Label>
              <Col>
                <Form.Control
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  value={firstName}
                />
              </Col>
            </Row>
            <br />
            <Row style={{ width: "100%" }}>
              <Form.Label column lg={4}>
                Last Name
              </Form.Label>
              <Col>
                <Form.Control
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  value={lastName}
                />
              </Col>
            </Row>
            <br />
            <Row style={{ width: "100%" }}>
              <Form.Label column lg={4}>
                Email
              </Form.Label>
              <Col>
                <Form.Control type="email" readOnly value={userData.email} />
              </Col>
            </Row>
            <br />
            <Row style={{ width: "100%" }}>
              <Form.Label column lg={4}>
                Phone
              </Form.Label>
              <Col>
                <Form.Control
                  onChange={(e) => setPhone(e.target.value)}
                  type="number"
                  value={phone}
                />
              </Col>
            </Row>
            <br />
            <Row style={{ width: "100%" }}>
              <Form.Label column lg={4}>
                Dob
              </Form.Label>
              <Col>
                <Form.Control
                  onChange={(e) => setDob(e.target.value)}
                  type="date"
                  value={dob ? formatDate(dob) : ""}
                />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer
        >
          <Button variant="primary" onClick={clickUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyDetails;
