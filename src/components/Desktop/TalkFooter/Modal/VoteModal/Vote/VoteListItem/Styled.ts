import { styled, Mui } from '@wapl/ui';

export const VoteListItemWrapper = styled('div')`
  max-height: 330px;
  overflow: auto;
  padding: 0;
  margin: 0;
  background-color: ${({ theme: { Color } }) => Color.Background[0]};
  border: 1px solid ${({ theme: { Color } }) => Color.Gray[200]};
  border-radius: 10px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const CheckboxWrap = styled(Mui.FormControlLabel)<{
  checked: boolean;
  checkedColor?: string;
}>`
  margin: 0;
  min-height: 32px;
  padding: 10px 20px;
  position: relative;
  background-color: ${({ checked, theme: { Color } }) =>
    checked ? Color.Gray[100] : Color.Background[0]};
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
  }
  &:last-of-type::after {
    content: none;
  }
  & .Mui-checked {
    background-color: ${({ checkedColor }) => checkedColor} !important;
  } //체크박스 색상
  & .MuiCheckbox-root,
  .MuiRadio-root {
    flex-shrink: 0;
    & + .MuiTypography-root {
      margin-left: 12px;
    }
  }
  & .Radio-root {
    flex-shrink: 0;
  }
  & .MuiTypography-root {
    width: 100%;
  }

  :hover {
    background-color: ${({ theme: { Color } }) => Color.Gray[100]};
  }
`;

export const ListWrap = styled('div')`
  display: flex;
  align-items: center;
  margin: 0;
  min-height: 52px;
  padding: 10px 20px;
  position: relative;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
  }
  &:last-of-type::after {
    content: none;
  }
`;

export const VoteItemContentWrapper = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const VoteItemContent = styled('strong')`
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;

export const VoteItemSubContentWrapper = styled('div')`
  margin-left: auto;
  display: flex;
`;

export const VoteCheckedIcon = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1.5px 0 0;
`;

export const VoteFirstChip = styled(`span`)`
  box-sizing: border-box;
  display: flex;
  height: 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.Color.White[100]};
  ${({ theme }) => theme.Font.Text.xs.Medium};
  white-space: nowrap;
  padding: 2px 6px;
  line-height: 12px;
  justify-content: center;
  margin-right: 4px;
`;

export const VoteItemCount = styled.button<{
  isAnonymous?: boolean;
  color?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: none;
  padding: 0;
  span {
    margin-left: 4px;
    ${({ theme: { Font } }) => Font.Text.xs.Regular};
    line-height: 1;
    color: ${({ color }) => color};
  }
  padding: 4px;
  border-radius: 8px;
  pointer-events: ${({ isAnonymous }) => isAnonymous && 'none'};
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
`;
export const Thumbnail = styled('div')`
  overflow: hidden;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #c4c4c4;
  :hover {
    cursor: pointer;
  }
`;
