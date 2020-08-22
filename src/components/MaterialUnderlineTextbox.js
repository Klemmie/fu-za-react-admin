import React from "react";
import styled from "styled-components";

function MaterialUnderlineTextbox(props) {
    return (
        <Container {...props}>
            <InputStyle placeholder={props.inputStyle || "Placeholder"} id={props.id + 1}></InputStyle>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  border-bottom-width: 1px;
  border-color: #D9D5DC;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  border-radius: 2px;
`;

const InputStyle = styled.input`
  font-family: Roboto;
  color: #000;
  padding-right: 5px;
  font-size: 16px;
  align-self: stretch;
  flex: 1 1 0%;
  line-height: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 2px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

export default MaterialUnderlineTextbox;
