import { Mui, styled } from '@wapl/ui';

export const HeaderButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: 0;
  &:hover {
    background: none;
  }
`;

export const CreateUserInfoWrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 7px 20px 5px;
`;

export const CreateContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

export const CreateUser = styled('span')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin-bottom: 6px;
`;

export const CreateDate = styled('span')`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const MenuButton = styled(Mui.IconButton)<{
  focused?: boolean;
}>`
  width: 24px;
  height: 24px;
  padding: 0px;
  display: flex;
  border: 0;
  background: none;
  padding: 0;
  margin-left: auto;
  &:hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
  background-color: ${({ focused, theme }) => focused && theme.Color.Black[6]};
`;

export const InfoWrapper = styled('div')`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 59px);
  & > span {
    ${({ theme }) => theme.Font.Text.s.Medium};
    margin: 20px 0 0 auto;
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
`;
export const VoteHeader = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;
export const VoteTitle = styled('strong')`
  ${({ theme }) => theme.Font.Text.l.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  margin-bottom: 12px;
`;

export const VoteContent = styled('p')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[600]};
  margin: 0 0 8px;
  overflow-wrap: break-word;
`;

export const DescWrapper = styled('div')`
  display: flex;
  align-items: center;
  & > span {
    ${({ theme }) => theme.Font.Text.s.Regular};
    color: ${({ theme: { Color } }) => Color.Gray[600]};
  }
  & > span:after {
    vertical-align: -1px;
    content: '';
    display: inline-block;
    width: 1px;
    height: 11px;
    margin: 0 8px;
    background-color: ${({ theme: { Color } }) => Color.Gray[600]};
  }
  & > span:last-of-type:after {
    content: none;
  }
`;
