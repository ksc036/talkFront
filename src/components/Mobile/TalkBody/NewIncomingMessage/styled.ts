import { styled } from '@wapl/ui';

export const ScrollToNewMsgButtonWrapper = styled('span')`
  display: flex;
  align-items: center;
  margin: 0 20px 0 12px;
  justify-content: space-between;
`;

export const UserName = styled('span')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  max-width: 92px;
  min-width: fit-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Message = styled('span')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserNameMessageWrapper = styled('span')`
  display: flex;
  width: 100%;
  margin: 0 8px 0 8px;
  gap: 8px;
  max-width: calc(100% - 24px - 24px - 20px);
`;
