import { styled } from '@wapl/ui';
export const ContactWrapper = styled('div')<{ isReply?: boolean }>`
  opacity: ${({ isReply }) => (isReply ? '50%' : 'unset')};
  width: 240px;
  padding-bottom: ${({ isReply }) => (isReply ? '8px' : 'unset')};
`;

export const ContactBody = styled('div')`
  background: ${({ theme }) => theme.Color.White[100]};
  border-radius: '16px';
  display: flex;
  padding: 24px 12px;
`;

export const ContactFooter = styled('div')`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.Color.White[50]};
  border-radius: 0px 0px 16px 16px;
  padding: 8px 12px;
  cursor: pointer;
`;

export const ContactInfo = styled('div')``;

export const ContactSubTitle = styled('div')`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[500]};
`;

export const ContactName = styled('div')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin-top: 4px;
`;

export const ContactDetailText = styled('div')`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;
