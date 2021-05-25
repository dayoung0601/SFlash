import React from "react";

import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";

import { actionCreators as postActions } from "../../redux/modules/post";
import { actionCreators as storyPostModalActions } from "../../redux/modules/storypostmodal";
import { actionCreators as imageActions } from "../../redux/modules/image2";
import { actionCreators as profileActions } from "../../redux/modules/profile";
import Slider from "react-slick";

import { useDispatch, useSelector } from "react-redux";
// 업로드용 파일선택 버튼
import Upload2 from "../../shared/Upload2";
// 수정용 파일선택 버튼
import UploadEdit from "../../shared/UploadEdit";
import SelectCate from "../SelectCate";
import Input from "../../elements/Input";
import Input2 from "../../elements/Input2";
// import { CgLogOut } from "react-icons/cg";

const UploadModal = (props) => {
  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    if (is_madal) {
      dispatch(imageActions.getModalPost(props));
      dispatch(profileActions.getUserInfoAPI(userId));
      return;
    }

    if (is_edit) {
      dispatch(imageActions.getPost(props.id));
    }
    dispatch(profileActions.getUserInfoAPI(userId));
  }, []);

  const dispatch = useDispatch();
  const preview = useSelector((state) => state.image2.preview);
  // 수정 페이지 이미지
  const onlyImg = useSelector((state) => state.image2.image);

  // 수정 페이지에서 추가한 이미지 파일 (서버로 보내주기 위해 저장)
  // const editFile = useSelector((state) => state.image2.edit_file);
  const profile = useSelector((state) => state.profile.user);

  const [contents, setContents] = React.useState(props.content);
  const [title, setTitle] = React.useState(props.title);
  const [images, setImages] = React.useState(false);

  const is_file = useSelector((state) => state.image2.file);
  const is_edit = props.id ? true : false; //게시글 작성시 props로 id를 받냐 안받냐 차이
  const is_madal = props.modal ? true : false;
  const nickname = localStorage.getItem("nickname");
  const is_category = useSelector((state) => state.category.select_category);

  const resetPreview = () => {
    const basicPreview =
      "https://firebasestorage.googleapis.com/v0/b/calender-ed216.appspot.com/o/back_01.PNG?alt=media&token=e39ad399-6ef6-4e68-b046-e4a7c2072e36";
    // 업로드하다 모달창을 닫을 때 남은 데이터들을 모두 초기화
    props.close();
    dispatch(imageActions.resetPreview([basicPreview], [])); // preview는 map함수를 쓰기 때문에 기본이미지를 배열안에 넣어주자
  };

  //게시물 작성시 조건을 걸어두었다
  const addPost = (e) => {
    if (!is_file) {
      window.alert("😗사진은 최소 1장 이상 업로드 해주세요!");
      return;
    }
    if (!contents) {
      window.alert("😗빈칸을 채워주세요...ㅎㅎ");
      return;
    }
    if (!title) {
      window.alert("😗빈칸을 채워주세요...ㅎㅎ");
      return;
    }
    if (!is_category) {
      window.alert("😗카테고리를 선택해주세요...ㅎㅎ");
      return;
    }

    //카테고리 선택 조건
    let post = {
      title: title,
      content: contents,
      latitude: props.latitude,
      longitude: props.longitude,
      spotName: props.spotName,
    };
    if (is_file) {
      dispatch(postActions.addPostAPI(post));
    } else {
      window.alert("😗사진은 최소 1장 이상 업로드 해주세요!");
      return;
    }
    props.close();
    resetPreview();
  };

  //게시물 수정 시 조건을 걸어 두었다
  const editPost = () => {
    if (!contents) {
      window.alert("😗빈칸을 채워주세요...ㅎㅎ");
      return;
    }
    if (!title) {
      window.alert("😗빈칸을 채워주세요...ㅎㅎ");
      return;
    }
    if (onlyImg.length === 0) {
      window.alert("😗사진을 최소 1장 이상 업로드 해주세요!");
      return;
    }
    if (onlyImg.length > 5) {
      window.alert("😗사진은 최대 5장까지 업로드 가능합니다...ㅎㅎ");
      return;
    }
    let edit = {
      title: title,
      contents: contents,
    };
    dispatch(storyPostModalActions.editStoryPostAPI(props.id, edit));
    props.close();
    dispatch(imageActions.resetEdit([])); //업로드 후 리덕스에 남은 수정 정보 모두 리셋
    //에딧파일 초기화...
  };

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };

  if (images.length === 0) {
    images.push(
      "https://firebasestorage.googleapis.com/v0/b/calender-ed216.appspot.com/o/back_01.PNG?alt=media&token=e39ad399-6ef6-4e68-b046-e4a7c2072e36"
    );
  }

  // const _post = {
  //   title: title,
  //   content: contents,
  // };

  //캐러셀 모듈 코드
  var settings = {
    dots: true, // 이미지 밑의 점을 출력할 건지 입력
    infinite: true,
    speed: 500, //이미지 넘어가는 속도
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <React.Fragment>
      <Component onClick={resetPreview} />
      <ModalComponent>
        <ModalHeader>
          <HeaderInner>
            <ExitContainer>
              <ExitBtn onClick={resetPreview}>
                <CloseIcon fontSize="large" />
              </ExitBtn>
            </ExitContainer>
            <ModalLeftHeader>
              <ProCircle
                src={
                  is_edit // 수정시에 작성자의 프로필 사진의 유무에 따라서 조건부 렌더링 설정
                    ? profile.profileImgUrl // 수정일때 프로필 이미지가 있냐?
                      ? profile.profileImgUrl
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                    : profile.profileImgUrl
                    ? profile.profileImgUrl // 업로드시 프로필 이미지가 있으면 그것으로 없으면 기본이미지로!
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                }
              />
              <ModalAuthor>{nickname}</ModalAuthor>
            </ModalLeftHeader>
            {/* 업로드와 수정시 파일선택 버튼이 다르게 설정 */}
          </HeaderInner>
        </ModalHeader>
        {/* 게시물 올릴때랑 수정일때 다르게 return */}

        {/* {is_edit? 수정할 때 : 수정안 할 때 via홀더를 보여준다 } */}
        {/* 게시물 작성시와 수정시 사진업로드 버튼을 따로 만들어 두었다 */}
        {is_edit ? <UploadEdit /> : <Upload2 />}
        {is_edit ? (
          onlyImg && ( //onlyimg는 게시물 수정시 보여지는 모든 이미지를 리스트다
            //만약 수정전 게시물 사진이 2개이면 수정시 2개의 이미지가 보이고 2개를 더 추가하면 onlyImg.length는 4가 된다
            <React.Fragment>
              {onlyImg.length >= 1 ? ( // 수정시 이미지가 1개 이상일때
                <Slider {...settings}>
                  {onlyImg.map((p, idx) => {
                    return (
                      <div>
                        {/* imgUrl이 없다면?! */}
                        <ModalImg
                          // 수정 중에 추가한 이미지엔 imgUrl이 없고 파일리더로 읽은 값만 있기 때문에 src에 그냥 값을 넣어주도록 조건설정
                          src={
                            onlyImg[idx].imgUrl
                              ? onlyImg[idx].imgUrl
                              : onlyImg[idx] // 파일리더로 읽은값 그대로 src에 삽입
                          }
                        >
                          <DeleteImg
                            onClick={() => {
                              dispatch(
                                // 서버로 삭제한 이미지 id 보내주기 위해 작성
                                imageActions.getDeleteId(onlyImg[idx].imgUrlId)
                              );
                              //미리 등록해둔 이미지가 있는 경우엔 imgUrlId값이 있어 그것으로 삭제가능
                              if (onlyImg[idx].imgUrlId) {
                                dispatch(
                                  imageActions.deleteImage(
                                    onlyImg[idx].imgUrlId
                                  )
                                );
                              } else {
                                // 만약 수정시 이미지를 추가하고 다시 올린이미지가 맘에 안들어 삭제하고 싶다
                                // 그러나 수정시 추가한 이미지엔 서버에서 준 이미지id가 따로 없다
                                dispatch(
                                  //그래서 이미지 idx 기준으로 삭제해준다!
                                  imageActions.deleteImageIdx(onlyImg[idx]) //asdjuifhuiawefhuiewbhfiubawefbiuewabiuf
                                );
                              }
                              // 이미지와 파일이 둘다 삭제되어야 서버에 보내줄때 차질이 없으름로
                              // 파일또한 idx 값을 이용해서 삭제해준다
                              dispatch(imageActions.deleteFileIdx(idx));
                              // 수정시 등록하는 사진에는 id값이 없어서 직접 값을 비교해서 삭제해줌
                            }}
                          >
                            삭제
                          </DeleteImg>
                        </ModalImg>
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                // 이미지를 모두 삭제하면 기본 설정 화면이 보인다
                <ModalImg
                  onClick={() => {
                    console.log("몇번 이미지인가?");
                  }}
                  src={
                    "https://firebasestorage.googleapis.com/v0/b/calender-ed216.appspot.com/o/back_01.PNG?alt=media&token=e39ad399-6ef6-4e68-b046-e4a7c2072e36"
                  }
                />
              )}
            </React.Fragment>
          )
        ) : (
          <React.Fragment>
            {/* 수정시가 아닌 일반 게시물 모달 */}
            {preview && preview ? ( //게시물이 여러개일땐 캐러셀을 구현하여 여러장을 보여줄 수 있도록 조건부 렌더링
              preview.length > 1 ? (
                <Slider {...settings}>
                  {preview.map((p, idx) => {
                    return (
                      <div>
                        <ModalImg src={preview[idx]}></ModalImg>
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                <ModalImg src={preview} />
              )
            ) : null}
          </React.Fragment>
        )}

        {/* 수정할때  */}

        <ModalBottomContainer>
          <MiddleBox>
            {/* 이미지 이외의 제목, 내용작성 */}
            {is_edit ? (
              <EditCommentBox>
                <React.Fragment>
                  <Title>
                    <Input2
                      id="outlined-multiline-static"
                      // label="📝제목 작성"
                      placeholder={props.title}
                      rows={1}
                      variant="outlined"
                      width={"100%"}
                      value={title}
                      _onChange={changeTitle}
                    ></Input2>
                  </Title>
                  <Input
                    id="outlined-multiline-static"
                    // label="📝제목 작성"
                    placeholder={props.content}
                    rows={6}
                    multiLine
                    width={"100%"}
                    variant="outlined"
                    value={contents}
                    _onChange={changeContents}
                  ></Input>
                </React.Fragment>
              </EditCommentBox>
            ) : (
              <React.Fragment>
                <Title>
                  <Input2
                    id="outlined-multiline-static"
                    // label="📝제목 작성"
                    placeholder={"제목작성..."}
                    rows={1}
                    variant="outlined"
                    value={title}
                    width={"100%"}
                    _onChange={changeTitle}
                  ></Input2>
                </Title>
                <Input
                  id="outlined-multiline-static"
                  // label="📝제목 작성"
                  placeholder={"내용작성..."}
                  rows={6}
                  multiLine
                  variant="outlined"
                  value={contents}
                  width={"100%"}
                  _onChange={changeContents}
                ></Input>
              </React.Fragment>
            )}
          </MiddleBox>
          {/* 카테고리는 수정할 수 없기때문에 게시글 수정 모달에선 가려준다 */}
          {is_edit ? null : <SelectCate></SelectCate>}
          {is_edit ? (
            <BottomEdit2 onClick={editPost}>수정하기</BottomEdit2>
          ) : (
            <BottomEdit onClick={addPost}>게시하기</BottomEdit>
          )}
        </ModalBottomContainer>
      </ModalComponent>
    </React.Fragment>
  );
};

const BottomEdit = styled.div`
  color: ${(props) => props.theme.main_color};
  font-weight: bold;
  /* background-color: ${(props) => props.theme.main_color}; */
  border: 2px solid ${(props) => props.theme.main_color};
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  padding: 12px 0px;
  border-radius: 7px;
  margin: 15px 0px;
  box-sizing: border-box;
  :hover {
    background-color: ${(props) => props.theme.main_color};
    color: white;
  }
  @media (max-width: 1440px) {
  }
  @media (max-width: 600px) {
    margin-bottom: 10vh;
  }
`;
const BottomEdit2 = styled.div`
  color: ${(props) => props.theme.main_color};
  font-weight: bold;
  /* background-color: ${(props) => props.theme.main_color}; */
  border: 2px solid ${(props) => props.theme.main_color};
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  padding: 12px 0px;
  border-radius: 7px;
  margin: 15px 0px;
  box-sizing: border-box;
  :hover {
    background-color: ${(props) => props.theme.main_color};
    color: white;
  }
  @media (max-width: 1440px) {
    margin: 15px 0px;
  }
  @media (max-width: 600px) {
  }
`;

const DeleteImg = styled.div`
  z-index: 4700;
  text-align: center;
  position: relative;
  /* background-color: red; */
  width: 75px;
  top: 15px;
  right: -25px;
  padding: 3px 8px;
  background-color: white;
  color: rgba(0, 0, 0, 0, 0.1);
  opacity: 0.5;
  border-radius: 5px;
  font-weight: bold;
  font-size: 13px;
  /* border: 1px solid rgba(0, 0, 0, 0, 0.08); */
  cursor: pointer;
`;

const ImgOutter = styled.div`
  text-align: center;
  display: table;
`;

const ModalImg = styled.div`
  background-image: url("${(props) => props.src}");
  background-size: cover;
  object-fit: cover;
  border: none;
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 4/3;
  background-position: center;
`;

const Component = styled.div`
  position: fixed;
  opacity: 0.8;
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 2000;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const ModalComponent = styled.div`
  border-radius: 0.5vw;
  position: fixed;
  width: 720px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fafafc;
  z-index: 2007;
  display: flex;
  flex-direction: column;
  border: none;
  box-sizing: border-box;
  min-width: 380px;
  margin: auto;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    display: none;
    /* background-color: transparent; */
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: lightgray;
  }
  @media (max-width: 1280px) {
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 97%;
  }
  @media (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    border-radius: none;
  }
`;

const ModalHeader = styled.div`
  /* background-color: red; */
  /* padding: 10px 30px; */
  /* border-bottom: 1px solid #efefef; */
  display: flex;
  /* align-items: center; */
  justify-content: space-between;
`;
const ModalLeftHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 0px auto;
`;

const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto auto;
  align-items: center;
  padding: 1.3vh 0px;
  width: 95%;
`;

const HeaderEdit = styled.div`
  color: ${(props) => props.theme.main_color};
  font-weight: bold;
  background-color: transparent;
  font-size: 14px;
  cursor: pointer;
`;

const ExitContainer = styled.div`
  z-index: 30;
  position: fixed;
  top: 0;
  right: 0;
  padding: 5px;
  opacity: 0.5;
`;

// color: ${(props) => (props.active ? props.theme.main_color : "grey")};
const ExitBtn = styled.button`
  cursor: pointer;
  color: ${(props) => props.theme.main_color};
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 14px;
`;

const ModalBottomContainer = styled.div`
  text-align: left;
  width: 93%;
  display: flex;
  margin: 10px auto;
  flex-direction: column;
`;

const EditCommentBox = styled.div``;

const ProCircle = styled.img`
  margin-left: 0.1vw;
  height: 1.7rem;
  width: 1.7rem;
  border-radius: 20px;
  background-size: cover;
  background-image: url("${(props) => props.src}");
  background-size: cover;
  cursor: pointer;
`;
const ModalAuthor = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
`;

const MiddleBox = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 300px; */
  width: 100%;
  @media (max-width: 1440px) {
    // 1450밑으로 넓이가 내려가면
    height: 235px;
    /* background-color: red; */
  }
  /* justify-content: space-between; */

  @media (max-width: 600px) {
    // 1450밑으로 넓이가 내려가면
    height: 220px;
  }
`;
const InputOutter = styled.div`
  margin: 0px auto;
  width: 100%;
`;

const Title = styled.div`
  margin-bottom: 1vh;
`;

const CateBtn = styled.div`
  font-size: bold;
  width: 6.5vw;
  /* border: 1px solid lightgray; */
  height: 3.5vh;
  border-radius: 10px;
`;

export default UploadModal;
