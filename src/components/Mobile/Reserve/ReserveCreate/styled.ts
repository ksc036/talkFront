import { AppBar, Mui, styled, TextField } from '@wapl/ui';

export const StyledHeader = styled(AppBar)`
  width: auto;
  background-color: ${({ theme: { Color } }) => Color.Background[0]};
`;

export const CurrentRoomWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  ${({ theme }) => theme.Font.Text.l.Regular};
  gap: 12px;
  align-items: center;
  padding: 16px 14px;
`;

export const TextFieldWrapper = styled(`div`)`
  height: calc(100% - 284px);
  margin: 14px 16px;
  & * {
    height: 100%;
  }
  & .MuiInputBase-multiline {
    display: flex;
    align-items: flex-start;
  }
`;

export const StyledTextField = styled(TextField)`
  background-color: #f5f7f9;
  border-radius: 12px;
  padding: 16px;
  ${({ theme }) => theme.Font.Text.l.Regular};
  color: ${({ theme }) => theme.Color.Gray[400]};
  height: 100%;
  overflow: scroll;
`;

export const DetailWrapper = styled('div')`
  padding: 0 20px;
  ${({ theme }) => theme.Font.Text.l.Regular};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 48px;
  align-items: center;
`;

export const StyledSelect = styled(Mui.Select)`
  border-color: #dadce0;
  ${({ theme }) => theme.Font.Text.s.Regular};
  height: 32px;
  width: 91px;
  line-height: 16px;
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: initial; /* 포커스 시 border 색상 변경 막기 */
    border-width: 1px; /* 포커스 시 border 굵기 변경 막기 */
  }
  svg {
    top: 8px;
  }
  & .MuiSelect-select {
    line-height: 20px;
  }
`;

export const StyledMenuItem = styled(Mui.MenuItem)`
  ${({ theme }) => theme.Font.Text.s.Regular};
  height: 32px;
`;

export const ButtonWrapper = styled(`div`)`
  width: 320px;
  height: 36px;
  display: flex;
  button {
    flex: 1;
  }
  margin: 32px 70px 20px 70px;
`;
