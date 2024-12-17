import { AppBar, styled, Mui, TextField, Button } from '@wapl/ui';

export const StyledHeader = styled(AppBar)`
  width: auto;
  background: ${({ theme }) => theme.Color.Background[0]};
`;

export const TextButton = styled(Mui.IconButton)<{ buttonColor?: string }>`
  &:hover {
    background: ${({ theme }) => theme.Color.Black[6]};
  }
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  ${({ theme }) => theme.Font.Text.l.Regular};
  color: ${({ buttonColor }) => buttonColor};
`;

export const ContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 10px 16px 0 16px;
  height: 100%;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const ScrollWrapper = styled('div')`
  height: 100%;
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
  background-color: ${({ theme: { Color } }) => Color.Background[0]};
  margin-bottom: 12px;
`;

export const TitleTextField = styled(TextField)`
  & .MuiFilledInput-root.Mui-focused{
    background-color: ${({ theme }) => theme.Color.Gray[100]};
  }
  & .MuiFormHelperText-root {
    text-align: right;
    ${({ theme }) => theme.Font.Text.xs.Regular};
    color: ${({ theme }) => theme.Color.Gray[400]};
  }
  & .MuiFilledInput-root {
    & input {
      padding: 8px 12px;
      ${({ theme }) => theme.Font.Text.l.Regular};
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
    & span {
      position: absolute;
      display: flex;
      bottom: -25px;
      right: 4px;
      ${({ theme }) => theme.Font.Text.xs.Regular};
      font-family: Spoqa Han Sans Neo;
    & input::placeholder {
      font-size: 16px;
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
    border: 1px solid ${({ theme }) => theme.Color.Gray[900]};
  }

  .MuiFormHelperText-root {
    text-align: right;
    ${({ theme }) => theme.Font.Text.xs.Regular};
    color: ${({ theme }) => theme.Color.Gray[400]};
    margin-bottom: 2px;
  }

  & .MuiInput-root {
    & input {
      padding: 0;
      margin-bottom: 6px;
      font-size: 116px;
      line-height: 18px;
      height: 18px;
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
    & input::placeholder {
      font-size: 16px;
      color: red;
    }
  }
  & .MuiInputBase-input {
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
`;

export const VoteCategoryList = styled('ul')`
  padding: 0;
  margin: 8px 0 16px;
  display: flex;
  flex-direction: column;
  color: red;
`;
export const VoteCategoryItem = styled('li')`
  padding: 0;
  margin: 4px 0;
  display: flex;
  align-items: center;
  justify-content: flex-between;
  &:first-of-type {
    margin-top: 0;
  }
  position: relative;
  .MuiBox-root {
    width: calc(100% - 32px);
  }
`;

export const VoteCategoryAddButton = styled('button')`
  display: flex;
  width: calc(100% - 32px);
  height: 48px;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.Color.Gray[500]};
  ${({ theme }) => theme.Font.Text.s.Regular};
  margin: 6px 8px 0 0;
  padding-left: 12px;
  gap: 8px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.Color.Gray[50]};
  & svg > path {
    fill: ${({ theme }) => theme.Color.Gray[500]};
  }
`;

export const VoteTextField = styled(TextField)`
  margin: 0;
  .MuiInputBase-root {
    border-radius: 8px;
  }
  .MuiInputBase-root.Mui-focused {
    .MuiOutlinedInput-notchedOutline {
      border-width: 1px;
    }
  }
  .MuiOutlinedInput-root {
    padding: 0 12px 0 0;
  }
  .MuiOutlinedInput-input {
    padding: 16px 12px;
    ${({ theme }) => theme.Font.Text.s.Regular};
    &::placeholder {
      ${({ theme }) => theme.Font.Text.s.Regular};
    }
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
`;

export const ImagesButton = styled('label')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  width: 24px;
  height: 24px;
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
    top: -2px;
    right: -2px;
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
  background-color: ${({ theme }) => theme.Color.Black[70]};
`;

export const HeaderButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: 0;
  margin-right: 8px;
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
  & svg {
    display: flex;
  }
`;

export const StyledButton = styled(Button)`
  min-width: 154px;
  margin-right: 12px;
  font-size: 13px;
  &:last-of-type {
    margin-right: 0;
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
  padding: 14px 0;
`;

export const StyledFormControl = styled(Mui.FormControlLabel)<{
  checkedColor?: string;
}>`
  margin: 0;
  & .MuiTypography-root {
    ${({ theme }) => theme.Font.Text.m.Regular};
    color: ${({ theme }) => theme.Color.Gray[900]};
    margin-left: 8px;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }
  & span {
    box-sizing: border-box;
  }
  & .Mui-checked {
    background-color: ${({ checkedColor }) => checkedColor} !important;
  } //체크박스 색상
`;

export const ButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 0 0 20px;
  margin-top: auto;
`;

export const DeadLineWrapper = styled('div')`
  margin-left: auto;
`;
