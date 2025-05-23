import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import "./main.scss";
import { useNavigate } from "react-router-dom";

export const MainContents = ({ solutionData, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return; // Exit the function if searchTerm is empty
    }
    const filteredResults = solutionData.filter(
      (solution) =>
        solution.sol_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.kor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    onSearch(filteredResults);
  };

  return (
    <div className="mainContents">
      <div className="mainBg">
        <div className="innerContainer">
          <div className="leftSide">
            <div className="mainTitleText">
              SK오앤에스의 모든 AI/DT Solution를 <br />
              모두 만나볼 수 있습니다.
            </div>
            <p className="subText">
              python, tensorflow, javascript, django 등의 여러가지 Language를
              활용하여 <br />
              현장에 필요한 Tool 개발하여 제공하고 있습니다.
            </p>
            <form onSubmit={handleSubmit} className="mainSearch">
              <div className="mainInputWrap">
                <input
                  type="text"
                  placeholder="Solution 이름을 검색하세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="mainSearchBtn" type="submit">
                <BsSearch size={24} />
              </button>
            </form>
          </div>

          <div className="rightSide">
            <div className="textwarp">
              <div className="text">아이디어를 등록해주세요.</div>
              <div className="subText">
                현장의 모든 생각은 우리 회사의 미래를 바꿀 수 있습니다.
              </div>
              <button
                className="ideaBtn"
                onClick={() => navigate("/ideaboard")}
              >
                ► 바로가기
              </button>
            </div>
            <img
              className="animation-updown"
              src={process.env.PUBLIC_URL + "/image/main/ideaMain01.png"}
              alt="title"
              onClick={() => navigate("/ideaboard")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContents;
