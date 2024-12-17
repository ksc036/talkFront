import { styled } from '@wapl/ui';

export const ItemWrapper = styled('div')`
  display: flex;
  padding: 13px 16px;
  flex-direction: column;
`;

export const ItemUserListWrapper = styled('div')`
  display: flex;
  align-items: center;
  height: 56px;
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
`;

export const ItemUserName = styled('div')`
  font-size: 16px;
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;
