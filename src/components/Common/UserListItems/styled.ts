import { styled } from '@wapl/ui';

export const ItemUserListWrapper = styled('div')`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 12px;
  width: 100%;
`;

export const ItemUserProfile = styled('div')`
  width: 100%;
  margin-left: 12px;
  display: grid;
  align-items: center;
  grid-template-columns: fit-content(100%) 1fr;
  gap: 4px;
`;

export const ItemUserName = styled('div')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
