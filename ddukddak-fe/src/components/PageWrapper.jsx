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

const PageWrapper = ({ children }) => {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default PageWrapper;
