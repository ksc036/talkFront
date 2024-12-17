import { styled } from '@wapl/ui';
export const MailWrapper = styled('div')<{ isReply?: boolean }>`
  width: 240px;
  opacity: ${({ isReply }) => (isReply ? '50%' : 'unset')};
  padding-bottom: ${({ isReply }) => (isReply ? '8px' : 'unset')};
`;

export const MailBody = styled('div')`
  background: ${({ theme }) => theme.Color.White[100]};
  border-radius: 16px 16px 0 0;
  padding: 12px;
`;

export const MailText = styled('strong')<{ color: string }>`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  font-weight: 400;
  color: ${({ color }) => color};
`;

export const MailTitleText = styled('div')<{
  mailStateType?: 'RECEIVE' | 'SEND' | undefined;
}>`
  ${({ theme }) => theme.Font.Text.m.Regular};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: ${({ mailStateType }) =>
    mailStateType === 'RECEIVE' ? '8px 0 12px' : '8px 0 0'};
`;

export const EmailText = styled('div')<{ senderName?: string }>`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme, senderName }) =>
    senderName ? theme.Color.Gray[600] : theme.Color.Gray[900]};
  margin-top: ${({ senderName }) => (senderName ? '2px' : '')};
`;

export const MailProfileWrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 16px 8px 4px;
  gap: 12px;
  ${({ theme }) => theme.Font.Text.m.Regular};
`;

export const MailProfileImage = styled('div')`
  overflow: hidden;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MailProfileImageWrapper = styled('div')`
  position: relative;
  & > svg {
    position: absolute;
    bottom: 0px;
    right: 0px;
    opacity: 40%;
    pointer-events: none;
  }
`;

export const MailFooter = styled('div')<{ color: string }>`
  display: flex;
  align-items: center;
  background: ${({ color }) => color};
  border-radius: 0px 0px 16px 16px;
  padding: 8px 12px;
  gap: 8px;
  cursor: pointer;
`;

export const MailCheckText = styled('strong')`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: auto;
`;

export const MailReplyWrapper = styled('div')<{
  msgTipUrl: string;
  isMine: boolean | undefined;
}>`
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: ${({ isMine }) => (isMine ? '0' : '')};
    left: ${({ isMine }) => (!isMine ? '0' : '')};
    width: 20px;
    height: 6px;
    background: ${({ msgTipUrl }) => `url(${msgTipUrl}) 0 0 no-repeat`};
  }
  max-width: 190px;
  width: fit-content;
  text-overflow: ellipsis;
  border-radius: 16px;
  color: ${({ theme }) => theme.Color.Gray[600]};
  ${({ theme }) => theme.Font.Text.s.Regular};
  padding: 12px;
  display: flex;
  justify-content: flex-start;
  gap: 4px;
  margin-bottom: 8px;
  position: relative;
`;
