import { styled, Mui, TextField, Button } from '@wapl/ui';

export const ContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 10px 20px 0;
  margin-left: 12px;
  width: 436px;
`;

export const ScrollWrapper = styled('div')`
  height: calc(100% - 160px);
  padding: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  ::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: none;
    border-radius: 4px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const TitleArea = styled('div')`
  width: 100%;
  margin-bottom: 12px;
`;

export const TitleTextField = styled(TextField)`
  .MuiFilledInput-root.Mui-focused {
    background-color: ${({ theme }) => theme.Color.Gray[100]};
    ::after {
      border: none;
    }
  }
  .MuiFormHelperText-root {
    text-align: right;
    ${({ theme }) => theme.Font.Text.xs.Regular};
    color: ${({ theme }) => theme.Color.Gray[400]};
  }

  & .MuiInput-root {
    & input {
      padding: 0;
      margin-bottom: 6px;
      font-size: 14px;
      line-height: 18px;
      height: 18px;
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
    & input::placeholder {
      font-size: 14px;
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
  }

  & .MuiBox-root {
    display: none;
  }
`;

export const ContentTextField = styled(TextField)`
  .MuiFilledInput-root {
    padding: 5px 0;
    min-height: 90px;
    align-items: start;
  }

  .MuiFilledInput-root.Mui-focused {
    background-color: ${({ theme }) => theme.Color.Gray[100]};
    ::after {
      border: none;
    }
  }

  .MuiFormHelperText-root {
    text-align: right;
    ${({ theme }) => theme.Font.Text.xs.Regular};
    color: ${({ theme }) => theme.Color.Gray[400]};
  }

  & .MuiInput-root {
    & textarea {
      padding: 0;
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 18px;
      height: 18px;
    }
    & textarea::placeholder {
      font-size: 14px;
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
  }

  & .MuiInputBase-input {
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
`;

export const VoteCategoryList = styled('ul')`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const VoteCategoryAddButtonWrapper = styled('div')`
  display: flex;
  margin-top: 6px;
  button {
    flex: 1;
  }
`;

export const VoteCategoryItem = styled('li')`
  padding: 0;
  margin: 6px 0;
  display: flex;
  align-items: center;
  &:first-of-type {
    margin-top: 0;
  }
`;

export const VoteTextField = styled(TextField)<{ width: number }>`
  margin: 0;
  width: ${({ width }) => `${width}`};
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

export const ImagesButton = styled('label')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    &:after {
      display: block;
    }
  }
  &:active {
    &:after {
      display: block;
      background-color: ${({ theme }) => theme.Color.Black[6]};
    }
  }
  & > input {
    display: none;
  }
  &:after {
    content: '';
    display: none;
    position: absolute;
    top: -4px;
    right: -4px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
`;
export const SelectedImageWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: 0;
  border-radius: 4px;
  overflow: hidden;
  &:hover {
    & > button {
      display: flex;
    }
  }
`;

export const RemoveImageButton = styled('button')`
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 1px;
  border: 0;
  padding: 0;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.Color.Gray[800]};
`;

export const HeaderButton = styled(Mui.IconButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0px;
  background: none;
  border: 0;
  &:hover {
    background: none;
  }
`;

export const AddDeleteButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  margin-left: 10px;
  &:hover {
    background: none;
  }
`;

export const StyledItemText = styled('span')`
  margin: 0 10px;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;
export const StyledList = styled(Mui.List)`
  padding: 0px;
`;
export const StyledListItem = styled(Mui.ListItem)`
  padding: 12px 0;
  max-height: 44px;
`;

export const StyledFormControl = styled(Mui.FormControlLabel)<{
  checkedColor?: string;
}>`
  margin: 0;
  & .MuiTypography-root {
    ${({ theme }) => theme.Font.Text.m.Regular};
    color: ${({ theme }) => theme.Color.Gray[900]};
    margin-left: 8px;
  }
  & .Mui-checked {
    background-color: ${({ checkedColor }) => checkedColor} !important;
  } //체크박스 색상
`;

export const ButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 0 70px 20px;
  margin-top: auto;
  button {
    flex: 1;
  }
`;

export const DeadLineWrapper = styled('div')`
  margin-left: auto;
  padding-right: 12px;
`;
