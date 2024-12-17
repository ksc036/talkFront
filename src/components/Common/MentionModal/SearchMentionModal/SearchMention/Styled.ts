import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  width: 344px;
  height: 38px;
  padding: 8px 8px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input`
  border: none;
  border-radius: 2px;
  width: 100%;
  &:focus {
    outline: 1px solid gray;
  }
  padding-left: 4px;
  box-sizing: border-box;
`;

export const WrapperMobile = styled.div`
  width: ${window.innerWidth}px;
  left: -19px;
  height: 38px;
  padding: 8px 8px;
  box-sizing: border-box;
  border-radius: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const StyledInputMobile = styled.input`
  border: none;
  border-radius: 2px;
  width: 90%;
  &:focus {
    outline: 1px solid gray;
  }
  padding-left: 4px;
  box-sizing: border-box;
`;
