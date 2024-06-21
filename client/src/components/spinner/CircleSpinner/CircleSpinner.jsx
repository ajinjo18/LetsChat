import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './circleSpinner.css';

const CircleSpinner = () => {
  return (
    <div className="spinner-container">
      <Spinner animation="border" role="status" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default CircleSpinner;
