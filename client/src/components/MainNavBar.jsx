import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { LuClipboardEdit } from "react-icons/lu";

import { FaCode } from "react-icons/fa6";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

import { AuthContext } from "../context/authContext";

export const MainNavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [showPersonDetail, setShowPersonDetail] = useState(false);
  const personDetailRef = useRef(null);
  const personIconRef = useRef(null);
  const [logoImage, setLogoImage] = useState(
    `${process.env.PUBLIC_URL}/image/logo/OrionLogoWhite.png`
  );

  const handlePersonClick = () => {
    setShowPersonDetail(!showPersonDetail);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPersonDetail &&
        personDetailRef.current &&
        !personDetailRef.current.contains(event.target) &&
        personIconRef.current &&
        !personIconRef.current.contains(event.target)
      ) {
        setShowPersonDetail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPersonDetail]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
      if (isScrolled) {
        setLogoImage(`${process.env.PUBLIC_URL}/image/logo/OroinLogoColor.png`);
      } else {
        setLogoImage(`${process.env.PUBLIC_URL}/image/logo/OrionLogoWhite.png`);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`mainNavbar ${scrolled ? "scrolled" : ""}`}>
      <div className="inner">
        <div className="logo">
          <Link to="/" className="link">
            <img src={logoImage} alt="mainLogo" />
          </Link>
        </div>
        <div className="controls">
          <Link to="/dashboard" className="menu regLink">
            <LuClipboardEdit size={24} />
            <span>신규 제안</span>
          </Link>
          <Link to="/portfolio" className="menu regLink">
            <FaCode size={24} />
            <span>Working Group</span>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/controlpanel" className="menu regLink">
              <AppRegistrationIcon size={24} />
              <span>Admin 관리</span>
            </Link>
          )}

          <div className="menu" onClick={handlePersonClick} ref={personIconRef}>
            <AccountCircleIcon size={24} />
            <span>Profile</span>
          </div>
          {showPersonDetail && (
            <div className="personDetail" ref={personDetailRef}>
              <div className="personInfo">
                <div className="name">{currentUser.name}</div>
                <div className="nameDetail">
                  <div className="dept">{currentUser.prntDeptName}</div>
                  <div className="dept">{currentUser.deptName}</div>
                </div>
              </div>
              <div className="logout">
                <button onClick={logout}>
                  <LogoutIcon />
                  LOGOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainNavBar;
