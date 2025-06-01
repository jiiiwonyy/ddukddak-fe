import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
  width: 100%;
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
`;

const Footer = styled.div`
  /* 버튼이 들어갈 영역 */
  width: 100%;
`;

const PageWrapper = ({ children, footer }) => {
  return (
    <Wrapper>
      <Content>{children}</Content>
      {footer && <Footer>{footer}</Footer>}
    </Wrapper>
  );
};

export default PageWrapper;
