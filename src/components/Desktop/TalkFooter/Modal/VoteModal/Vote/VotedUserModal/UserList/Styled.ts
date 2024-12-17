import { styled } from '@wapl/ui';

export const ItemWrapper = styled('div')`
  display: flex;
  padding: 13px 8px;
  flex-direction: column;
`;

export const ItemTitleWrapper = styled('div')`
  display: flex;
  align-items: center;
  height: 52px;
`;

export const ItemTitle = styled(`span`)<{ color: string }>`
  ${({ theme }) => theme.Font.Text.m.Regular};
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  padding: 0 12px;
  & > span {
    color: ${({ color }) => color};
    margin-left: 4px;
  }
`;

export const ItemUserListWrapper = styled('div')`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 12px;
`;

export const NoUser = styled(ItemUserListWrapper)`
  ${({ theme }) => theme.Font.Text.m.Regular};
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme: { Color } }) => Color.Gray[500]};
  padding: 10px 0;
`;

export const ItemUserProfile = styled('div')`
  overflow: hidden;
  margin-left: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ItemUserName = styled('div')`
  font-size: 16px;
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;
