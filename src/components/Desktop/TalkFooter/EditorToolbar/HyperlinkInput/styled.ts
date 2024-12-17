import { styled, TextField } from '@wapl/ui';

export const HyperLinkWrapper = styled.div`
  height: 100%;
  width: 100%;
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

export const CloseButtonWrapper = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 12px;
  left: -12px;
`;

export const TitleArea = styled.div`
  ${({ theme }) => theme.Font.Text.xl};
  margin: 6px 0;
`;

export const LinkTextField = styled(TextField)`
  & .MuiInputBase-input::placeholder {
    font-size: 13px;
  }
  .MuiInputBase-root {
    border-radius: 8px;
  }
  .MuiInputBase-root.Mui-focused {
    .MuiOutlinedInput-notchedOutline {
      border-width: 1px;
    }
  }
  .MuiOutlinedInput-input {
    padding: 10px 12px;
    ${({ theme }) => theme.Font.Text.s.Regular};
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 6px 0;
`;
