import React from 'react';

const PageNotFound = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
  };

  const contentStyle = {
    maxWidth: '600px',
    padding: '20px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
  };

  const iconStyle = {
    fill: '#dc3545',
    width: '64px',
    height: '64px',
  };

  const headingStyle = {
    fontSize: '6rem',
    margin: 0,
  };

  const paragraphStyle = {
    fontSize: '1.5rem',
    margin: '20px 0',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '1.25rem',
    border: '2px solid #007bff',
    padding: '10px 20px',
    borderRadius: '5px',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const linkHoverStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
  };

  const [hover, setHover] = React.useState(false);

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <svg
          style={iconStyle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 z M 12 4 C 16.42 4 20 7.58 20 12 C 20 16.42 16.42 20 12 20 C 7.58 20 4 16.42 4 12 C 4 7.58 7.58 4 12 4 z M 11 7 L 11 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z M 11 15 L 11 17 L 13 17 L 13 15 L 11 15 z" />
        </svg>
        <h1 style={headingStyle}>404</h1>
        <p style={paragraphStyle}>Oops! The page you are looking for does not exist.</p>
        <a
          href="/"
          style={hover ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;


