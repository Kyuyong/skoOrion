import React, { useContext } from "react";
import "./sideBar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";

const SideBar = () => {
  const { currentUser } = useContext(AuthContext);

  // Admin 권한 확인 함수
  const isAdmin = () => {
    return currentUser && currentUser.isAdmin;
  };

  return (
    <div className="sideBar">
      <Link to="/">
        <div className="logo">Orion</div>
      </Link>

      <hr
        style={{
          width: "70%",
          border: "1px solid #8c8c8c",
        }}
      />
      <Link to="/dashboard">
        <div className="menuNm">Dashboard</div>
      </Link>
      <Link to="/ideaboard">
        <div className="menuNm">신규 제안</div>
      </Link>
      <Link to="/ideaboard/devtable">
        <div className="menuNm">개발 과제 관리</div>
      </Link>
      {isAdmin() && (
        <Link to="/ideaboard/solmgmt">
          <div className="menuNm">System활용률</div>
        </Link>
      )}
    </div>
  );
};

export default SideBar;
