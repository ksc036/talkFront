import { Checkbox, css, styled } from '@wapl/ui';

export const Wrapper = styled('div')<{ isMine: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
`;

export const MessageWrapper = styled('div')<{
  isMine: boolean;
  isHead: boolean;
}>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
  max-width: 71%;
  padding: ${({ isMine, isHead }) =>
    isMine
      ? isHead
        ? '8px 8px 8px 0px'
        : '0 8px 8px 0px'
      : isHead
      ? '8px 0px 8px 8px'
      : '0 0px 8px 8px'};
  ${({ isMine }) =>
    isMine &&
    css`
      margin-left: auto;
    `}
`;

export const Message = styled('div')<{ isMine: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
`;

export const MessageBodyWrapper = styled('div')<{ isMine: boolean }>`
  margin-left: 4px;
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
`;

export const MessageItemWrapper = styled('div')<{ isMine: boolean }>`
  display: flex;
  align-items: flex-end;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
`;

export const MessageInfoWrapper = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const SendDate = styled('div')`
  ${({ theme }) => theme.Font.Text.xxs.Regular};
  color: ${({ theme }) => theme.Color.Gray[500]};
  white-space: nowrap;
`;

export const UnreadCount = styled('div')<{ color?: string }>`
  margin-bottom: 2px;
  ${({ theme }) => theme.Font.Text.xxs.Regular};
  color: ${({ color }) => color};
`;

export const MessageInfo = styled('div')<{ isMine: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  margin: 0 4px;
  right: ${({ isMine }) => (isMine ? 0 : 'unset')};
`;

export const DeleteCheckBox = styled(Checkbox)`
  position: absolute;
  left: 16px;
  align-self: center;
`;
