import React from "react";
import styled from "styled-components";
import axios from "axios";

import {
  Container,
  Title,
  InputStyle,
  SolidBtn,
  BorderBtn,
  TextBtn,
} from "../../Css/loginSignupCss";
import { Grid } from "../../elements/index";
import { actionCreators as userActions } from "../../redux/modules/user";

import { history } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState("");
  const [pwd, setPwd] = React.useState("");

  // 일반 로그인
  const onLogin = () => {
    if (email === "" || pwd === "") {
      window.alert("아이디 혹은 비밀번호를 입력하지 않으셨습니다.");
      return;
    }
    dispatch(userActions.loginAPI(email, pwd));
    history.push("/");
  };

  return (
    <React.Fragment>
      <Container>
        <Title>Login</Title>
        <InputStyle
          placeholder="이메일 입력"
          type="type"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <InputStyle
          placeholder="비밀번호 입력"
          type="password"
          onChange={(e) => {
            setPwd(e.target.value);
          }}
        />

        <BorderBtn bg="grey" onClick={onLogin}>
          로그인하기
        </BorderBtn>
        <Grid padding="10px">
          <TextBtn onClick={() => history.push("/findemailpwd")}>
            이메일/비밀번호 찾기
          </TextBtn>
        </Grid>
        <Grid padding="10px">
          <TextBtn onClick={() => history.push("/signup")}>
            회원가입 하러가기
          </TextBtn>
        </Grid>
        <SolidBtn
          bg="#1ec800"
          color="#ffffff"
          // onClick = {naverLoginAPI}
          onClick={() => {
            window.location.href =
              "http://seungwook.shop/oauth2/authorize/naver?redirect_uri=http://localhost:3000/";
          }}
        >
          네이버로 로그인
        </SolidBtn>
        <SolidBtn
          bg="#fee500"
          onClick={() => {
            window.location.href =
              "http://seungwook.shop/oauth2/authorize/kakao?redirect_uri=http://localhost:3000/";
          }}
        >
          카카오 로그인
        </SolidBtn>
        <SolidBtn
          bg="#f45a5c"
          color="#ffffff"
          onClick={() => {
            window.location.href =
              "http://seungwook.shop/oauth2/authorize/google?redirect_uri=http://localhost:3000/";
          }}
        >
          Google 로그인
        </SolidBtn>
      </Container>
    </React.Fragment>
  );
};

export default Login;
