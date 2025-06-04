import React, { useState, useRef, useEffect, useContext } from "react";
import "./ideaRegister.scss";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";

const IdeaRegister = ({
  onClose,
  editMode = false,
  ideaData = null,
  onUpdate,
}) => {
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  // 각 Select 컴포넌트별로 독립적인 상태 생성
  const [businessField, setBusinessField] = React.useState("");
  const [jobField, setJobField] = React.useState("");
  const [usability, setUsability] = React.useState("");
  const [duplication, setDuplication] = React.useState("");
  const [tbohStatus, setTbohStatus] = React.useState("");
  // 유용성과 개선내역을 위한 별도의 상태 생성
  const [usabilityPoints, setUsabilityPoints] = React.useState([]);
  const [improvementPoints, setImprovementPoints] = React.useState([]);
  const [usePeriod, setUsePeriod] = React.useState("");
  const [useScope, setUseScope] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [projectType, setProjectType] = useState("");
  const [targetUser, setTargetUser] = useState("");

  // 각 에디터별 개별 상태값 생성
  const [background, setBackground] = useState("");
  const [progress, setProgress] = useState("");
  const [quantitativeEffect, setQuantitativeEffect] = useState("");
  const [qualitativeEffect, setQualitativeEffect] = useState("");

  // 부서 검증을 위한 상태 추가
  const [verifyDepartment, setVerifyDepartment] = useState(null);

  // 각 에디터별 개별 ref 생성
  const backgroundRef = useRef(null);
  const progressRef = useRef(null);
  const quantitativeEffectRef = useRef(null);
  const qualitativeEffectRef = useRef(null);

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (editMode && ideaData) {
      // 기본 정보 설정
      setTitle(ideaData.title || "");
      setBusinessField(ideaData.business_field || "");
      setJobField(ideaData.job_field || "");
      setUsability(ideaData.usability || "");
      setDuplication(ideaData.duplication || "");
      setTbohStatus(ideaData.tboh_status || "");
      setUsePeriod(ideaData.use_period || "");
      setUseScope(ideaData.use_scope || "");
      setPlatform(ideaData.platform || "");
      setProjectType(ideaData.project_type || "");
      setTargetUser(ideaData.target_user || "");

      // 에디터 내용 설정
      setBackground(ideaData.background || "");
      setProgress(ideaData.progress || "");
      setQuantitativeEffect(ideaData.quantitative_effect || "");
      setQualitativeEffect(ideaData.qualitative_effect || "");

      // 유용성 설정
      if (ideaData.usability_points) {
        setUsabilityPoints(
          typeof ideaData.usability_points === "string"
            ? ideaData.usability_points.split(",")
            : ideaData.usability_points
        );
      }

      // 개선내역 설정
      if (ideaData.improvement_points) {
        setImprovementPoints(
          typeof ideaData.improvement_points === "string"
            ? ideaData.improvement_points.split(",")
            : ideaData.improvement_points
        );
      }

      // 검증 부서 설정
      if (ideaData.VerifyDepartment) {
        // 여기서는 팀 정보만 있으므로 본부 정보는 초기화될 때까지 비워둡니다
        setVerifyDepartment({
          team: ideaData.VerifyDepartment,
          fullPath: ideaData.VerifyDepartment,
        });

        // 초기화 후 다른 useEffect에서 처리되도록 별도 상태 설정
        // setSelectedTeam(ideaData.VerifyDepartment);
      }
    }
  }, [editMode, ideaData]);

  const handleBusinessFieldChange = (event) => {
    setBusinessField(event.target.value);
  };

  const handleJobFieldChange = (event) => {
    setJobField(event.target.value);
  };

  const handleUsabilityChange = (event) => {
    setUsability(event.target.value);
  };

  const handleDuplicationChange = (event) => {
    setDuplication(event.target.value);
  };

  const handleTbohStatusChange = (event) => {
    setTbohStatus(event.target.value);
  };

  const theme = useTheme();

  // 유용성 변경 핸들러
  const handleUsabilityPointsChange = (event) => {
    const {
      target: { value },
    } = event;
    setUsabilityPoints(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // 개선내역 변경 핸들러
  const handleImprovementPointsChange = (event) => {
    const {
      target: { value },
    } = event;
    setImprovementPoints(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const getBetterList = [
    "분석",
    "공유",
    "편의성",
    "신뢰성확보",
    "보안",
    "자동화",
    "연동및연계",
    "Biz",
    "Process",
  ];

  const enhanceList = [
    "비용절감",
    "생산성향상",
    "지표개선",
    "ESG",
    "Biz관련",
    "품질",
    "VOC",
    "재난재해",
    "안전",
    "AI/DT",
    "RM및장애",
    "예방활동",
    "기타",
  ];

  function getStyles(name, selectedItems, theme) {
    return {
      fontWeight: selectedItems.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  // 각 에디터별 MutationObserver 설정
  useEffect(() => {
    const setupObserver = (ref, name) => {
      if (!ref.current) return;

      const observer = new MutationObserver((mutations) => {
        // console.log(`${name} 에디터 내부 DOM 변화 감지됨`, mutations);
      });

      const config = {
        childList: true,
        subtree: true,
      };

      const editor = ref.current ? ref.current.getEditor().root : null;
      if (editor) {
        observer.observe(editor, config);
        return observer;
      }
      return null;
    };

    const backgroundObserver = setupObserver(backgroundRef, "추진 배경");
    const progressObserver = setupObserver(progressRef, "추진 내역");
    const quantitativeObserver = setupObserver(
      quantitativeEffectRef,
      "정량적 효과"
    );
    const qualitativeObserver = setupObserver(
      qualitativeEffectRef,
      "정성적 효과"
    );

    return () => {
      if (backgroundObserver) backgroundObserver.disconnect();
      if (progressObserver) progressObserver.disconnect();
      if (quantitativeObserver) quantitativeObserver.disconnect();
      if (qualitativeObserver) qualitativeObserver.disconnect();
    };
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [
        {
          color: [
            "black",
            "gray",
            "red",
            "green",
            "blue",
            "orange",
            "violet",
            "#d0d1d2",
          ],
        },
        { background: [] },
      ],
      [{ align: [] }],
    ],
  };

  // 폼 제출 핸들러 추가
  const handleUpdate = (e) => {
    if (e) e.preventDefault();
    // 실제 업데이트 로직 여기에 추가
    // console.log("폼이 제출되었습니다");
  };

  const handleUsePeriodChange = (event) => {
    setUsePeriod(event.target.value);
  };

  const handleUseScopeChange = (event) => {
    setUseScope(event.target.value);
  };

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  // 부서 선택 관련 상태 및 핸들러
  const [headqtList, setHeadqtList] = useState([]);
  const [teamsByHeadqt, setTeamsByHeadqt] = useState({});
  const [selectedHeadqt, setSelectedHeadqt] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // 컴포넌트 마운트 시 본부 및 팀 데이터 로드
  useEffect(() => {
    const fetchTeams = async () => {
      setTeamsLoading(true);
      try {
        const response = await axios.get("/api/ideas/teams");
        const teamData = response.data;

        // 본부 목록 추출
        const headqtArray = Object.keys(teamData);

        // console.log("API에서 가져온 본부 및 팀 데이터:", teamData);
        // console.log("추출된 본부 목록:", headqtArray);

        setHeadqtList(headqtArray);
        setTeamsByHeadqt(teamData);
        setTeamsLoading(false);

        // 수정 모드인 경우 VerifyDepartment 팀에 해당하는 본부 찾기
        if (editMode && ideaData && ideaData.VerifyDepartment) {
          const team = ideaData.VerifyDepartment;

          // 각 본부를 순회하면서 팀이 속한 본부 찾기
          for (const headqt of headqtArray) {
            if (teamData[headqt] && teamData[headqt].includes(team)) {
              // console.log(`${team}이 속한 본부 찾음: ${headqt}`);
              setSelectedHeadqt(headqt);
              setSelectedTeam(team);
              setTeams(teamData[headqt]);
              break;
            }
          }
        }
      } catch (error) {
        // console.error("본부 및 팀 데이터 로드 오류:", error);
        setTeamsLoading(false);
      }
    };

    fetchTeams();
  }, [editMode, ideaData]);

  // 본부 선택 시
  const handleHeadqtChange = (event) => {
    const newValue = event.target.value;
    // console.log("본부 선택 이벤트:", event);
    // console.log("선택된 본부:", newValue);
    setSelectedHeadqt(newValue);
    setSelectedTeam("");

    if (newValue && teamsByHeadqt[newValue]) {
      const teamsArray = teamsByHeadqt[newValue];
      // console.log(`선택된 본부(${newValue})의 팀 목록:`, teamsArray);
      setTeams(teamsArray);
    } else {
      // console.log("선택된 본부가 없거나 해당 본부의 팀 목록이 비어있습니다.");
      setTeams([]);
    }
  };

  // 팀 선택 시
  const handleTeamChange = (event) => {
    const newValue = event.target.value;
    setSelectedTeam(newValue);

    // 선택된 부서 정보 상태 업데이트
    if (newValue && selectedHeadqt) {
      const departmentInfo = {
        headqt: selectedHeadqt,
        team: newValue,
        // 표시용 전체 경로
        fullPath: `${selectedHeadqt} > ${newValue}`,
      };
      setVerifyDepartment(departmentInfo);
    } else {
      setVerifyDepartment(null);
    }
  };

  // 등록/수정 버튼 핸들러
  const handleSubmit = async () => {
    try {
      // 검증 부서가 선택되었는지 확인
      if (!verifyDepartment || !verifyDepartment.team) {
        alert("검증 부서를 선택해주세요.");
        return; // 함수 실행 중단
      }

      // 각 입력 필드의 값을 수집
      const formData = {
        title: title || document.querySelector(".titleInput").value,
        background,
        progress,
        quantitative_effect: quantitativeEffect,
        qualitative_effect: qualitativeEffect,
        project_type:
          projectType ||
          document.querySelector(
            'input[name="row-radio-buttons-group"]:checked'
          )?.value ||
          "",
        target_user:
          targetUser ||
          document.querySelector(
            'input[name="row-radio-buttons-group2"]:checked'
          )?.value ||
          "",
        business_field: businessField,
        job_field: jobField,
        usability: usability,
        duplication: duplication,
        tboh_status: tbohStatus,
        use_period: usePeriod,
        use_scope: useScope,
        platform: platform,
        usability_points: usabilityPoints.join(","), // 유용성 - 별도의 state 사용
        improvement_points: improvementPoints.join(","), // 개선내역 - 별도의 state 사용
        // 로그인한 사용자 정보 추가
        user_id: currentUser?.userId || "", // 사번
        name: currentUser?.name || "", // 이름
        prnt_dept_name: currentUser?.prntDeptName || "", // 제안본부
        dept_name: currentUser?.deptName || "", // 제안팀
        // 검증 부서 정보 추가 - 팀 정보만 저장
        VerifyDepartment: verifyDepartment ? verifyDepartment.team : "",
      };

      // console.log(`${editMode ? "수정" : "등록"}할 아이디어 데이터:`, formData);

      if (editMode) {
        // 수정 모드: PUT 요청으로 업데이트
        await axios.put(`/api/ideas/${ideaData.id}`, formData);
        // console.log("아이디어 수정 성공:", response.data);

        // 데이터 업데이트 콜백 호출 (제공된 경우)
        if (typeof onUpdate === "function") {
          await onUpdate();
        }

        alert("아이디어가 성공적으로 수정되었습니다.");
      } else {
        // 등록 모드: POST 요청으로 새로 등록
        await axios.post("/api/ideas/register", formData);
        // console.log("아이디어 등록 성공:", response.data);

        // 데이터 업데이트 콜백 호출 (제공된 경우)
        if (typeof onUpdate === "function") {
          await onUpdate();
        }

        alert("아이디어가 성공적으로 등록되었습니다.");
      }

      // 모달 닫기
      onClose();
    } catch (error) {
      // console.error(`아이디어 ${editMode ? "수정" : "등록"} 오류:`, error);

      // 서버에서 반환된 오류 메시지 표시 - 개선된 오류 처리
      if (error.response) {
        // 서버에서 응답이 왔지만 오류 상태 코드인 경우
        if (
          error.response.status === 400 &&
          error.response.data.missingFields
        ) {
          // 필수 항목 누락 오류
          const missingFields = error.response.data.missingFields.join(", ");
          alert(
            `필수 항목이 누락되었습니다. 다음 항목을 확인해주세요: ${missingFields}`
          );
        } else {
          // 다른 종류의 서버 오류
          alert(
            `오류: ${
              error.response.data.error ||
              error.response.data.message ||
              "알 수 없는 오류가 발생했습니다."
            }`
          );
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        alert("서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        // 요청 설정 중 오류 발생
        alert(`요청 오류: ${error.message}`);
      }
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="titleBox">
          <h2>{editMode ? "과제 수정" : "신규 과제 제안"}</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />
        <div className="ideaRegister">
          <div className="left">
            <div className="titleWrap">
              <div className="titleBox">
                <div className="title">제목</div>
              </div>
              <div className="desc">
                <input
                  type="text"
                  className="titleInput"
                  placeholder="제목을 입력하세요"
                  style={{ width: "99%" }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="gap-10"></div>
            <div className="contentBox">
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">추진 배경</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
                    <div className="editorContainer">
                      <ReactQuill
                        ref={backgroundRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={background}
                        onChange={setBackground}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">추진 내역</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
                    <div className="editorContainer">
                      <ReactQuill
                        ref={progressRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={progress}
                        onChange={setProgress}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">정량적 효과</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
                    <div className="editorContainer">
                      <ReactQuill
                        ref={quantitativeEffectRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={quantitativeEffect}
                        onChange={setQuantitativeEffect}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">정성적 효과</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
                    <div className="editorContainer">
                      <ReactQuill
                        ref={qualitativeEffectRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={qualitativeEffect}
                        onChange={setQualitativeEffect}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="projectCategory">
              <span className="fieldLabel">개발 유형</span>
              <FormControl>
                <RadioGroup
                  row
                  name="row-radio-buttons-group"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <FormControlLabel
                    value="신규개발"
                    control={<Radio />}
                    label="신규개발"
                  />
                  {/* <FormControlLabel
                    value="고도화"
                    control={<Radio />}
                    label="고도화"
                  />
                  <FormControlLabel
                    value="내재화"
                    control={<Radio />}
                    label="내재화"
                  /> */}
                </RadioGroup>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">수행 주체</span>
              <FormControl>
                <RadioGroup
                  row
                  name="row-radio-buttons-group2"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                >
                  <FormControlLabel
                    value="전사"
                    control={<Radio />}
                    label="전사"
                  />
                  <FormControlLabel
                    value="협업"
                    control={<Radio />}
                    label="협업"
                  />
                  <FormControlLabel
                    value="자체"
                    control={<Radio />}
                    label="자체"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">사업분야</span>
              <div className="fieldRow">
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="demo-simple-select-standard"
                    value={businessField}
                    onChange={handleBusinessFieldChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="Access">Access</MenuItem>
                    <MenuItem value="AOC">AOC</MenuItem>
                    <MenuItem value="Biz">Biz</MenuItem>
                    <MenuItem value="Infra설비">Infra설비</MenuItem>
                    <MenuItem value="SO">SO</MenuItem>
                    <MenuItem value="기업문화">기업문화</MenuItem>
                    <MenuItem value="경영지원">경영지원</MenuItem>
                    <MenuItem value="안전보건">안전보건</MenuItem>
                    <MenuItem value="자산">자산</MenuItem>
                    <MenuItem value="전송">전송</MenuItem>
                    <MenuItem value="공통">공통</MenuItem>
                  </Select>
                </FormControl>
                <span className="fieldLabel">업무분야</span>
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="job-field-select"
                    value={jobField}
                    onChange={handleJobFieldChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="품질">품질</MenuItem>
                    <MenuItem value="고장">고장</MenuItem>
                    <MenuItem value="RM">RM</MenuItem>
                    <MenuItem value="시설">시설</MenuItem>
                    <MenuItem value="CE">CE</MenuItem>
                    <MenuItem value="사무">사무</MenuItem>
                    <MenuItem value="Biz">Biz</MenuItem>
                    <MenuItem value="서버">서버</MenuItem>
                    <MenuItem value="교육">교육</MenuItem>
                    <MenuItem value="자산">자산</MenuItem>
                    <MenuItem value="안전">안전</MenuItem>
                    <MenuItem value="기타">기타</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">활용도</span>
              <div className="fieldRow">
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="usability-select"
                    value={usability}
                    onChange={handleUsabilityChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="전사">전사</MenuItem>
                    <MenuItem value="본부">본부</MenuItem>
                    <MenuItem value="팀">팀</MenuItem>
                    <MenuItem value="담당자">담당자</MenuItem>
                    <MenuItem value="대외기관">대외기관</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </Select>
                </FormControl>
                <span className="fieldLabel">중복여부</span>
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="duplication-select"
                    value={duplication}
                    onChange={handleDuplicationChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="신규">신규</MenuItem>
                    <MenuItem value="타시스템 기능중복">
                      타시스템 기능중복
                    </MenuItem>
                    <MenuItem value="기존시스템 고도화">
                      기존시스템 고도화
                    </MenuItem>
                    <MenuItem value="기존시스템 개선추가">
                      기존시스템 개선추가
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">TBOH 여부</span>
              <RadioGroup
                row
                name="tboh-status-group"
                value={tbohStatus}
                onChange={handleTbohStatusChange}
              >
                <FormControlLabel
                  value="해당없음"
                  control={<Radio />}
                  label="해당없음"
                />
                <FormControlLabel value="TO" control={<Radio />} label="TO" />
                <FormControlLabel
                  value="TBOH"
                  control={<Radio />}
                  label="TBOH"
                />
                <FormControlLabel value="BOH" control={<Radio />} label="BOH" />
              </RadioGroup>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">활용기간</span>
              <div className="fieldRow">
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="use-period-select"
                    value={usePeriod}
                    onChange={handleUsePeriodChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="매일">매일</MenuItem>
                    <MenuItem value="주3회">주3회</MenuItem>
                    <MenuItem value="주1회">주1회</MenuItem>
                    <MenuItem value="월1회">월1회</MenuItem>
                    <MenuItem value="이벤트 발생시">이벤트 발생시</MenuItem>
                  </Select>
                </FormControl>
                <span className="fieldLabel">사용범위</span>
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="use-scope-select"
                    value={useScope}
                    onChange={handleUseScopeChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="필수사용">필수사용</MenuItem>
                    <MenuItem value="선택적사용">선택적사용</MenuItem>
                    <MenuItem value="대체가능">대체가능</MenuItem>
                    <MenuItem value="미사용 무방">미사용 무방</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">플랫폼</span>
              <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                <Select
                  id="platform-select"
                  value={platform}
                  onChange={handlePlatformChange}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="Web">Web</MenuItem>
                  <MenuItem value="Mobile">Mobile</MenuItem>
                  <MenuItem value="Noti">Noti</MenuItem>
                  <MenuItem value="Web+Mobile">Web+Mobile</MenuItem>
                  <MenuItem value="Web+Noti">Web+Noti</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">유용성</span>
              <FormControl sx={{ m: 0, width: 300 }}>
                <Select
                  labelId="usability-points-label"
                  id="usability-points-select"
                  multiple
                  value={usabilityPoints}
                  onChange={handleUsabilityPointsChange}
                  variant="standard"
                  MenuProps={MenuProps}
                >
                  {getBetterList.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, usabilityPoints, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">개선내역</span>
              <FormControl sx={{ m: 0, width: 300 }}>
                <Select
                  labelId="improvement-points-label"
                  id="improvement-points-select"
                  multiple
                  value={improvementPoints}
                  onChange={handleImprovementPointsChange}
                  variant="standard"
                  MenuProps={MenuProps}
                >
                  {enhanceList.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, improvementPoints, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* 검증 부서 컨테이너 추가 */}
            <div className="projectCategory">
              <span className="fieldLabel">검증 부서</span>
              <div className="verifyDepartmentContainer">
                {verifyDepartment ? (
                  <div className="selectedDepartmentInfo">
                    <p>선택된 검증 부서: {verifyDepartment.fullPath}</p>
                  </div>
                ) : (
                  <div className="selectedDepartmentInfo">
                    {/* 공간 유지를 위한 빈 div */}
                  </div>
                )}
                <div className="selectorsRow">
                  <div className="selectContainer">
                    <Select
                      value={selectedHeadqt}
                      onChange={handleHeadqtChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <em>
                              {teamsLoading
                                ? "로딩 중..."
                                : "본부를 선택하세요"}
                            </em>
                          );
                        }
                        return selected;
                      }}
                      disabled={teamsLoading}
                    >
                      <MenuItem disabled value="">
                        <em>
                          {teamsLoading ? "로딩 중..." : "본부를 선택하세요"}
                        </em>
                      </MenuItem>
                      {headqtList.map((headqt) => (
                        <MenuItem key={headqt} value={headqt}>
                          {headqt}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div className="selectContainer">
                    <Select
                      value={selectedTeam}
                      onChange={handleTeamChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>팀을 선택하세요</em>;
                        }
                        return selected;
                      }}
                      disabled={!selectedHeadqt || teams.length === 0}
                    >
                      <MenuItem disabled value="">
                        <em>팀을 선택하세요</em>
                      </MenuItem>
                      {teams.map((team) => (
                        <MenuItem key={team} value={team}>
                          {team}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button className="registerButton" onClick={handleSubmit}>
            {editMode ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaRegister;
