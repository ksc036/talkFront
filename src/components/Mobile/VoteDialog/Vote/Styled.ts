import { styled, AppBar } from '@wapl/ui';

export const Wrapper = styled(`div`)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;
export const StyledHeader = styled(AppBar)`
  width: auto;
  background-color: ${({ theme }) => theme.Color.Background[0]};
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

export const CreateUserInfoWrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 7px 20px 5px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const CreateContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
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

export const MenuButton = styled.button`
  display: flex;
  border: 0;
  background: none;
  padding: 0;
  margin-left: auto;
`;

export const InfoWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: calc(100% - 59px);
  & > span {
    ${({ theme }) => theme.Font.Text.s.Medium};
    margin: 20px 0 0 auto;
    padding: 0 20px 0 20px;
  }
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;
export const VoteHeader = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;
export const VoteTitle = styled('strong')`
  padding: 20px 20px 0 20px;
  ${({ theme }) => theme.Font.Text.l.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  margin-bottom: 12px;
`;

export const VoteContent = styled('p')`
  padding: 0 20px 0 20px;
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[600]};
  margin: 0 0 8px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  overflow-wrap: break-word;
`;

export const DescWrapper = styled('div')`
  padding: 0 20px 0 20px;
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
