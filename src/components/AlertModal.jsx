import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const AlertBox = styled.div`
  background: #fff;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  text-align: center;
  min-width: 220px;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: #a0d2f5;
  color: #222;
  font-size: 1rem;
  cursor: pointer;
`;

const CustomAlert = ({ open, message, onClose }) => {
  if (!open) return null;
  return (
    <Overlay>
      <AlertBox>
        <div>{message}</div>
        <Button onClick={onClose}>확인</Button>
      </AlertBox>
    </Overlay>
  );
};

export default CustomAlert;
