import React, { useState } from "react";
import { Grid, Text, Button } from "../elements";
import { history } from "../redux/configStore";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import FavoriteIcon from "@material-ui/icons/Favorite";

import Modal from "./Modal";
import CloudQueueIcon from "@material-ui/icons/CloudQueue";
import SendIcon from "@material-ui/icons/Send";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { actionCreators as modalActions } from "../redux/modules/modal";
import { actionCreators as likeActions } from "../redux/modules/like";
import { actionCreators as PostActions } from "../redux/modules/post";

import "../Css/Post.css";

//로그인 후에 이용가능 합니다
const Post2 = (props) => {
  const paging = useSelector((state) => state.post.paging);

  const like = useSelector((state) => state.like.like);

  console.log("좋아요 정보", like);
  React.useEffect(() => {
    console.log("시작");
    dispatch(likeActions.getLikePost());
  }, []);

  const dispatch = useDispatch();
  // console.log(props);

  // 이미지들 반복문으로 뽑아오기
  let image_list = [];

  if (props.img_url) {
    //이거 좀 위태위태한거 같다
    for (let i = 0; i < props.img_url.length; i++) {
      image_list.push(props.img_url[i]);
    }
  }

  // console.log("이미지 리스트!", image_list);
  // 댓글들 반복문으로 뽑아오기
  let comment_list = [];

  if (props.comment) {
    for (let i = 0; i < props.comment.length; i++) {
      comment_list.push(props.comment[i]);
    }
  }
  const [is_modal, setDetailModal] = useState();

  const openModal = () => {
    setDetailModal(true);
  };
  const closeDetailModal = () => {
    setDetailModal(false);
  };

  // 좋아요 함수
  const addLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(likeActions.addLikeAPI(props.id, props)); //서버
    // dispatch(PostActions.editLikeP(props.id, props)); // 리덕스
  };

  const disLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(likeActions.disLikeAPI(props.id, props));
    // dispatch(PostActions.editLikeD(props.id, props));
  };

  // console.log("뭘까......???", image_list[0].imgUrl);

  //스타일 컴포넌트//
  // const PostImage = image_list[0].imgUrl;
  // console.log("포스트 프롭스", props);
  // console.log(props.post_image_url);
  return (
    <React.Fragment>
      <Card>
        {/* src={props.post_image_url[0]} */}

        <PostBox
          onClick={openModal}
          src={
            image_list[0].imgUrl //썸네일 이미지가 있다면>?
              ? image_list[0].imgUrl
              : null
          }
        >
          {/* 이거자체가 지금 투명 0 */}
          <div className={"hoverDark"}>
            {like}
            <div className={"PostFont"}>
              {props.like ? (
                <FavoriteIcon
                  fontSize="24px"
                  onClick={disLike}
                  style={{ fontSize: 40 }}
                />
              ) : (
                <FavoriteBorderIcon
                  fontSize="24px"
                  onClick={addLike}
                  style={{ fontSize: 40 }}
                />
              )}
              <div>{props.likeCnt} </div>
              <br />
              {props.spotName}
            </div>
          </div>
          {/* 투명도 0 */}
        </PostBox>
      </Card>
      {is_modal ? (
        <Modal
          close={closeDetailModal}
          {...props} //여기서 모달에 모든 정보를 넘겨주는 구나!
        />
      ) : null}
    </React.Fragment> //여기서 댓글 정보랑 모든걸 넘겨주려나?
  );
};

const PostBox = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("${(props) => props.src}");
  cursor: pointer;
`;

const hoverBox = keyframes`
  0% {
    transform: translateY(10px);
    opacity: 0.3;

  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
`;

const Card = styled.div`
  z-index: 200;
  width: 100%;
  height: 100%;
`;

const CntBox = styled.span`
  margin: 8px 0px 8px 2px;
`;

export default Post2;
