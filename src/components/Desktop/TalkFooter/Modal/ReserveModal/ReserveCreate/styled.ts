import { Mui, styled, TextField } from '@wapl/ui';

export const CurrentRoomWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  ${({ theme }) => theme.Font.Text.m.Regular};
  gap: 12px;
  align-items: center;
  padding: 20px 0px 20px 0px;
  margin: 0 20px;
  border-bottom: 1px solid #e8eaed;
`;

export const StyledTextField = styled(TextField)`
  height: 347px;
  width: 420px;
  background-color: #f5f7f9;
  border-radius: 12px;
  padding: 12px;
  margin: 12px auto;
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[400]};
  overflow: scroll;
  & * {
    height: 100%;
  }
  & .MuiInputBase-multiline {
    display: flex;
    align-items: flex-start;
  }
`;

export const ReservedAtWrapper = styled('div')`
  padding: 0 20px;
`;

export const AlarmedAtWrapper = styled('div')`
  padding: 0 20px;
  ${({ theme }) => theme.Font.Text.m.Regular};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledSelect = styled(Mui.Select)`
  border-color: #dadce0;
  ${({ theme }) => theme.Font.Text.s.Regular};
  height: 32px;
  width: 91px;
  line-height: 16px;
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: initial;
    border-width: 1px;
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
