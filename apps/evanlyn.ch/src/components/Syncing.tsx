import styled, { keyframes } from 'styled-components';

const colorChange = keyframes`
  0% { border-color: blue; }
  25% { border-color: green; }
  50% { border-color: yellow; }
  75% { border-color: red; }
  100% { border-color: blue; }
`;

const StyledDiv = styled.div<{visible:boolean}>`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  min-height: 100vh;
  width: 100vw;
  animation: ${colorChange} 2s linear infinite; 
  opacity: ${props => props.visible ? 0.4 : 0};
  transition: opacity 0.5s ease-in-out;
  border-width: 10px;
  border-style: solid;
`;

export const Syncing = (props:{visible:boolean}) => {
    return (
        <StyledDiv visible={props.visible}>
        </StyledDiv>
    );
};