import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

import "./home.css";

import Footer from "../../components/mobile/Footer/Footer";

import Post from "../../components/Post/Post";
import Logout from "../Logout/Logout";
import UserProfileOptions from '../ProfileSection/UserProfileOptions/UserProfileOptions'
import MyDetails from '../ProfileSection/MyDetails/MyDetails'
import Security from '../ProfileSection/security/Security'
import FollowersSuggections from '../FollowersSuggections/FollowersSuggections'
import MyProfileView from "../ProfileSection/MyProfileView/MyProfileView";
import AddPost from "../../components/AddPost/AddPost";
import SearchBar from "../../components/SearchBar/SearchBar";

import { darkMode, lightMode } from "../../utils/themeConfig";
import SavedPosts from "../ProfileSection/SavedPosts/SavedPosts";
import FriendProfileView from "../ProfileSection/FriendProfileView/FriendProfileView";

const Home = ({ role }) => {

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const renderContent = () => {
    switch (role) {
      case "homeFeeds":
        return <Post role={"allPost"} />
      case "addPost":
        return <AddPost />;
      case "singlePost":
        return <Post role={"singlePost"} />;
      case "search":
        return(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <div style={{ position: 'fixed' }}>
              <SearchBar role={role} />
            </div>
          </div>
        ) 
      case "userProfile":
        return <FriendProfileView />
      case "myProfile":
        return <MyProfileView />;
      case "security":
        return <Security />;
      case "myDetails":
        return <MyDetails />;
      case "savedPosts":
        return <SavedPosts />;
      default:
      //   return <MyprofileDesktop />;
    }
  };

  if (isMobile) {
    return (
      <div
        className="d-flex flex-column justify-content-between"
        style={{ minHeight: "100vh", paddingTop: "12vh", marginBottom:'100px' }}
      >
        <div
          // className="d-flex justify-content-center"
          style={{
            flex: "1",
            paddingTop: "5px",
          }}
        >
          <div
            style={{
              padding: "8px",
              marginBottom: "60px",
              // width: "fit-content",
              margin: "0 auto",
            }}
          >
            {renderContent()}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <div className="d-md-flex p-4 justify-content-between">
        <div className="col-md-3 col-sm-3 rounded">
          <div
            className='border border-light-subtle'
            style={{
              height: "40vh",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <UserProfileOptions />
          </div>
          <div
            className='border border-light-subtle'
            style={{
              height: "50px",
              borderRadius: "8px",
            }}
          >
            <Logout />
          </div>
        </div>

        <div className="scroll-container col-md-5 col-sm-5" style={{ paddingBottom: "200px" }}>
          {role === "homeFeeds" && (
              <AddPost />
          )}
          <div>{renderContent()}</div>
        </div>

        <div
          className="col-md-3 col-sm-3 border border-light-subtle"
          style={{
            height: "50vh",
            borderRadius: "8px",
          }}
        >
          <div style={{textAlign:'center'}}>
            <p style={{ marginTop: "10px" }}>Followers Suggections</p>
          </div>
          <FollowersSuggections role={role} />
        </div>
      </div>
    </div>
  );
};

export default Home;
