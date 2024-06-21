import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../utils/baseUrl';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { setIsNotAuthenticated } from '../../redux/user/user';
import { useDispatch, useSelector } from 'react-redux';
import FollowersSuggections from '../FollowersSuggections/FollowersSuggections';
import { RiCloseCircleFill, RiUserAddFill } from 'react-icons/ri';
import { updatesentFollowRequestTrue } from '../../redux/sentFollowRequest/sentFollowRequest';
import { darkMode, lightMode } from '../../utils/themeConfig';

const SearchBar = ({role}) => {

  const socketId = useSelector(state => state.socketId.value);
  const userId1 = useSelector(state => state.user.userData)
  const userId = userId1._id

  const theme = useSelector((state) => state.theme.value);
  const [colorMode, setColorMode] = useState(theme);

  useEffect(() => {
    if (theme == "darkMode") {
      setColorMode(darkMode);
    } else {
      setColorMode(lightMode);
    }
  }, [theme]);

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
    } else {
      fetchSuggestions(searchTerm);
    }
  }, [searchTerm]);

  const fetchSuggestions = async (searchTerm) => {
    try {
        const response = await axiosInstance.get(`/user/users-search?query=${searchTerm}`);
        const data = response.data;

        const formattedSuggestions = data
        .map(user => {
          if (user._id !== userId) {
            return {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              imageUrl: `${baseUrl}/img/${user.profilePicture}`
            };
          } else {
            return null;
          }
        })
        .filter(user => user !== null); 
        
        setSuggestions(formattedSuggestions);
    } catch (error) {
      if (error.message === 'Refresh token expired') {
        dispatch(setIsNotAuthenticated())
        navigate('/login')
      } else {
          console.error(error);
      }
    }
};

  const showProfile = (id) => {
    navigate(`/user-profile/${id}`)
  }


  const handleChange = (string) => {
    setSearchTerm(string);
  };

  const clearSearch = () => {
    setSearchTerm('');
    // handleOnSearch('');
  };

  return (
    <>
     <div style={{ position: 'relative', width: 300 }}>
     <input 
      className={`bg-${colorMode.deskTopNav} border border-light-subtle` }
        value={searchTerm}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        placeholder="Type to search"
        style={{
          width: '100%',
          padding: '10px 40px 10px 10px',
          outline: 'none',
        }}
      />
      {searchTerm && (
        <RiCloseCircleFill 
          onClick={clearSearch}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#888'
          }}
        />
      )}
    {suggestions && suggestions.length > 0 && (
      <div className={`bg-${colorMode.deskTopNav} border border-light-subtle` } style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        marginTop: '5px',
        borderRadius: '4px',
        padding: '10px'
      }}>
        {suggestions.map(user => (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '10px' 
            }} 
            key={user.id}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                onClick={() => showProfile(user.id)} 
                src={user.imageUrl} 
                alt={user.name} 
                style={{ borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer' }} 
              />
              <div style={{ marginLeft: '10px' }}>
                <h6 style={{ marginTop: '10px', marginBottom: '0' }}>{user.name}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
    {
        role === 'search' && suggestions.length === 0 && (
          <div style={{marginTop:'20px'}}>
            <div>
              <p style={{ borderBottom: "10px" }}>Followers Suggections</p>
            </div>
            <FollowersSuggections />
          </div>
        )
    }
    </>
  );
}

export default SearchBar;
