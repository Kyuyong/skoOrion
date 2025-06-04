import React, { useState, useEffect, useContext } from "react";
import "./ideaPilot.scss";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";

const IdeaPilot = ({ onClose, ideaId, ideaData, isViewMode }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [productivity, setProductivity] = useState("");
  const [cost, setCost] = useState("");
  const [quantitybasis, setQuantitybasis] = useState("○ 생산성\n○ 비용");
  const [loading, setLoading] = useState(false);
  const [pilotData, setPilotData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState(isViewMode);
  const [author, setAuthor] = useState("");
  const [fullIdeaData, setFullIdeaData] = useState(null); // 전체 아이디어 데이터 저장
  const [isUpdating, setIsUpdating] = useState(false); // 수정 모드인지 신규 등록 모드인지 구분

  const { currentUser } = useContext(AuthContext);

  // 이미 완료된 단계인 경우 데이터 조회 및 아이디어 정보 가져오기
  useEffect(() => {
    const fetchPilotData = async () => {
      if (!ideaId) return;

      try {
        setLoading(true);

        // 아이디어 기본 정보 조회 (부서 정보를 가져오기 위해)
        const ideaResponse = await axios.get(`/api/ideas/${ideaId}`);
        console.log("아이디어 기본 정보 조회 결과:", ideaResponse.data);

        // 전체 아이디어 데이터 저장
        setFullIdeaData(ideaResponse.data);

        // 파일럿 데이터 조회
        const response = await axios.get(`/api/ideas/pilot/${ideaId}`);
        console.log("파일럿 데이터 조회 결과:", response.data);

        // 데이터가 있으면 상태 업데이트
        if (response.data) {
          setPilotData(response.data);
          // 파일럿 데이터가 있으면 viewMode를 true로 설정 (강제 읽기 모드)
          setViewMode(true);
          // 수정 모드임을 표시
          setIsUpdating(true);

          // 폼에 데이터 설정
          setProductivity(response.data.productivity || "");
          setCost(response.data.cost || "");
          setQuantitybasis(response.data.quantitybasis || "○ 생산성\n○ 비용");
          setFileName(
            response.data.filePath
              ? response.data.filePath.split("/").pop()
              : ""
          );

          // 작성자 정보 저장
          if (response.data.author_id) {
            setAuthor(response.data.author_id);
          }
        } else {
          // 데이터가 없으면 신규 등록 모드
          setIsUpdating(false);
        }
      } catch (error) {
        console.error("파일럿 데이터 조회 오류:", error);
        if (viewMode) {
          setError("저장된 파일럿 데이터를 불러올 수 없습니다.");
        }
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchPilotData();
  }, [ideaId]);

  // 읽기 모드 변경 시 상태 설정
  useEffect(() => {
    // 파일럿 데이터가 없는 경우에만 isViewMode에 따라 viewMode 업데이트
    if (!pilotData) {
      setViewMode(isViewMode);
    }
  }, [isViewMode, pilotData]);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName("");
    }
  };

  // 입력 필드 핸들러
  const handleProductivityChange = (event) => {
    setProductivity(event.target.value);
  };

  const handleCostChange = (event) => {
    setCost(event.target.value);
  };

  const handleQuantitybasisChange = (event) => {
    setQuantitybasis(event.target.value);
  };

  // 편집 권한을 확인하는 함수 (작성자, Admin 또는 작성자와 같은 부서 소속인 경우에만 수정 가능)
  const hasEditPermission = () => {
    // 현재 사용자가 없는 경우 권한 없음
    if (!currentUser) {
      console.log("현재 로그인한 사용자가 없습니다. 권한 없음.");
      return false;
    }

    // Admin인 경우 권한 있음
    if (currentUser.isAdmin) {
      console.log("관리자 권한으로 접근: 권한 있음");
      return true;
    }

    // 작성자인 경우 권한 있음
    if (currentUser.userId === author) {
      console.log("작성자로 접근: 권한 있음");
      return true;
    }

    // 작성자의 부서와 현재 사용자의 부서 비교
    // 아이디어 데이터에서 작성자 부서 정보 가져오기
    const authorDeptName = fullIdeaData?.dept_name;
    // 현재 사용자 부서
    const userDeptName = currentUser.deptName;

    console.log("권한 확인 정보:");
    console.log("- 사용자 정보:", currentUser);
    console.log("- 사용자 부서:", userDeptName);
    console.log("- 작성자 부서:", authorDeptName);
    console.log("- 아이디어 데이터:", fullIdeaData);

    // 부서명이 정확히 일치하거나, 하나가 다른 하나를 포함하는 경우 (부서명 표기 방식이 다를 수 있음)
    if (
      userDeptName &&
      authorDeptName &&
      (userDeptName.trim() === authorDeptName.trim() ||
        userDeptName.includes(authorDeptName) ||
        authorDeptName.includes(userDeptName))
    ) {
      console.log("작성자와 같은 부서 소속 확인됨: 권한 있음");
      return true;
    }

    console.log("권한 없음 - 관리자/작성자/같은 부서가 아님");
    return false;
  };

  // 편집 모드로 전환하는 함수
  const handleEdit = () => {
    // 수정 권한이 있는지 확인
    if (hasEditPermission()) {
      setViewMode(false);
    } else {
      alert(
        "수정 권한이 없습니다. 작성자, 같은 부서 소속 또는 관리자만 수정할 수 있습니다."
      );
    }
  };

  // 등록 버튼 클릭 핸들러
  const handleRegister = async () => {
    // 등록 권한 확인
    if (!hasEditPermission()) {
      alert(
        "등록 권한이 없습니다. 작성자, 같은 부서 소속 또는 관리자만 등록할 수 있습니다."
      );
      return;
    }

    try {
      setLoading(true);
      setError(""); // 오류 상태 초기화

      // 필수 필드 검증 (문자열이 아닌 경우에 대한 처리 추가)
      const productivityStr = String(productivity || "");
      const costStr = String(cost || "");
      const quantitybasisStr = String(quantitybasis || "");

      if (!productivityStr.trim()) {
        alert("생산성을 입력해주세요.");
        setLoading(false);
        return;
      }

      if (!costStr.trim()) {
        alert("비용을 입력해주세요.");
        setLoading(false);
        return;
      }

      if (!quantitybasisStr.trim()) {
        alert("정량적 기대효과 근거를 입력해주세요.");
        setLoading(false);
        return;
      }

      // 파일 업로드
      let filePath = pilotData?.filePath || "";
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("path", "pilot");

        // 서버에 파일 업로드 요청
        const fileUploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("파일 업로드 성공:", fileUploadResponse.data);
        filePath = fileUploadResponse.data.filePath;
      }

      // 파일럿 데이터 등록
      const pilotFormData = {
        productivity: String(productivity || ""),
        cost: String(cost || ""),
        quantitybasis: String(quantitybasis || ""),
        filePath: filePath, // 파일 경로 포함
      };

      console.log("아이디어 ID:", ideaId);
      console.log("등록할 파일럿 데이터:", pilotFormData);
      console.log("작업 모드:", isUpdating ? "업데이트" : "신규 등록");

      // API 호출
      const response = await axios.post(
        `/api/ideas/pilot/${ideaId}`,
        pilotFormData
      );

      console.log("파일럿 데이터 등록 성공:", response.data);
      console.log("결과 - 아이디어 ID:", response.data.idea_id);
      console.log("업데이트 여부:", response.data.is_update);

      alert(
        `파일럿 결과가 성공적으로 ${
          isUpdating ? "업데이트" : "등록"
        }되었습니다.`
      );

      // 등록 완료 후 데이터 업데이트하고 읽기 모드로 전환
      setPilotData(response.data);
      setViewMode(true);
      setIsUpdating(true); // 다음에는 업데이트 모드가 됨

      // 등록 완료 후 모달 닫기
      onClose();
    } catch (error) {
      console.error("파일럿 데이터 등록 오류:", error);
      alert(
        "데이터 등록 중 오류가 발생했습니다: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PilotModalOverlay">
      <div className="PilotModalContent">
        <div className="titleBox">
          <h2>
            {viewMode
              ? "현장 Pilot 결과 (효과성 재검증)"
              : "현장 Pilot 결과 (효과성 재검증)"}
          </h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        {/* 로딩 메시지 표시 */}
        {/* {loading && (
          <div className="loadingMessage">데이터를 불러오는 중입니다...</div>
        )} */}

        {/* 오류 메시지 표시 */}
        {error && <div className="errorMessage">{error}</div>}

        {/* 데이터가 없는 경우 메시지 표시 (읽기 모드일 때만) */}
        {viewMode && dataLoaded && !pilotData && !loading && (
          <div className="noDataMessage">저장된 파일럿 데이터가 없습니다.</div>
        )}

        {(!viewMode || (viewMode && dataLoaded && pilotData)) && (
          <>
            <div className="rowContainer">
              {/* 생산성 */}
              <div className="rowContainerSmall">
                <div className="fieldLabel">생산성</div>
                <TextField
                  className="Textfield"
                  variant="outlined"
                  value={productivity}
                  onChange={handleProductivityChange}
                  disabled={viewMode}
                  InputProps={{
                    readOnly: viewMode,
                  }}
                />
                <div className="fieldText">M/M</div>
              </div>
              {/* 비용 */}
              <div className="rowContainerSmall">
                <div className="fieldLabel">비용</div>
                <TextField
                  className="Textfield"
                  variant="outlined"
                  value={cost}
                  onChange={handleCostChange}
                  disabled={viewMode}
                  InputProps={{
                    readOnly: viewMode,
                  }}
                />
                <div className="fieldText">억 원</div>
              </div>
            </div>
            <div className="rowContainerBasis">
              <div className="fieldLabel">
                정량적
                <br />
                기대효과
                <br />
                근거
              </div>
              <TextField
                className="Textfield"
                variant="outlined"
                multiline
                rows={12}
                fullWidth
                value={quantitybasis}
                onChange={handleQuantitybasisChange}
                disabled={viewMode}
                InputProps={{
                  readOnly: viewMode,
                }}
              />
            </div>
            <div className="rowContainerResult">
              <div className="fieldLabel">결과</div>
              {/* 파일명 표시 */}
              <TextField
                className="Textfield"
                variant="outlined"
                value={fileName}
                placeholder="첨부된 파일 없음"
                InputProps={{
                  readOnly: true,
                }}
              />
              {/* 파일 선택 (읽기 모드에서는 숨김) */}
              {!viewMode && (
                <>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                  {/* 첨부파일 업로드 버튼 */}
                  <button
                    className="uploadButton"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/image/icons/upload-white.png`}
                      alt="업로드 아이콘"
                      className="uploadIcon"
                    />
                    첨부파일 upload
                  </button>
                </>
              )}
              {/* 파일 다운로드 버튼 (저장된 파일이 있고 읽기 모드일 때만 표시) */}
              {viewMode && pilotData && pilotData.filePath && (
                <button
                  className="downloadButton"
                  onClick={() =>
                    window.open(`/uploads/${pilotData.filePath}`, "_blank")
                  }
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/image/icons/download-white.png`}
                    alt="다운로드 아이콘"
                    className="downloadIcon"
                  />
                  파일 다운로드
                </button>
              )}
            </div>
            {/* 버튼 컨테이너 */}
            <div className="buttonContainer">
              {viewMode ? (
                // 읽기 모드: 왼쪽 버튼 = 수정, 오른쪽 버튼 = 닫기
                <>
                  <button
                    className="cancelButton"
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    수정
                  </button>
                  <button
                    className="registerButton"
                    onClick={onClose}
                    disabled={loading}
                  >
                    닫기
                  </button>
                </>
              ) : (
                // 편집 모드: 왼쪽 버튼 = 취소, 오른쪽 버튼 = 등록
                <>
                  <button
                    className="cancelButton"
                    onClick={onClose}
                    disabled={loading}
                  >
                    취소
                  </button>
                  <button
                    className="registerButton"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    {loading ? "등록 중..." : isUpdating ? "업데이트" : "등록"}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaPilot;
