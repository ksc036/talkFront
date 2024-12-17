import { styled, keyframes, css } from '@wapl/ui';

const TextMessageWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

export const MyMessageWrapper = styled(TextMessageWrapper)<{
  hasReply?: boolean;
}>`
  align-self: flex-end;
  padding-bottom: ${({ hasReply }) => (hasReply ? 0 : '8px')};
`;

export const OtherMessageWrapper = styled(TextMessageWrapper)<{
  hasReply?: boolean;
}>`
  align-self: flex-start;
  padding-bottom: ${({ hasReply }) => (hasReply ? 0 : '8px')};
`;

export const MsgTip = styled('div')<{ color: string; isMine: boolean }>`
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: ${({ color }) => `6px solid ${color}`};
  position: absolute;
  top: 0px;
  left: ${({ isMine }) => (isMine ? `none` : `0px`)};
  right: ${({ isMine }) => (isMine ? `0px` : `none`)};
`;

const ContentWrapper = styled('div')<{
  isMobile?: boolean;
}>`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  border-radius: 16px;
  padding: 12px;
  user-select: ${({ isMobile }) => (isMobile ? 'none' : 'text')};
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 20px;
    height: 6px;
  }
`;

export const MyContentWrapper = styled(ContentWrapper)`
  background: ${({ color }) => color};
  &::after {
    left: unset;
    right: 0;
  }
`;

export const OtherContentWrapper = styled(ContentWrapper)`
  background: ${({ color }) => color};
  &::after {
    left: 0;
    right: unset;
  }
`;

export const DeletedMessageWrapper = styled('div')<{ isReply?: boolean }>`
  padding-bottom: ${({ isReply }) => (isReply ? '8px' : 'unset')};
`;

const Message = styled('div')<{
  isDeleted?: boolean;
  isReply?: boolean;
}>`
  display: flex;
  ${({ theme }) => theme.Font.Text.m.Regular};
  margin: 0;
  padding: 0;
`;

export const MyMessage = styled(Message)<{
  deletedColor?: string;
  replyColor?: string;
}>`
  color: ${({ isDeleted, isReply, color, deletedColor, replyColor }) =>
    isDeleted ? deletedColor : isReply ? replyColor : color};
  min-height: 18px;
  .ql-editor {
    padding: 0px;
  }
`;

export const OtherMessage = styled(Message)<{ deletedColor?: string }>`
  color: ${({ theme, isDeleted, isReply, color, deletedColor }) =>
    isDeleted ? deletedColor : isReply ? theme.Color.Gray[600] : color};
  min-height: 18px;
  .ql-editor {
    padding: 0px;
  }
`;

export const ParentWrapper = styled('div')<{ isReplyCombined?: boolean }>`
  padding-bottom: ${({ isReplyCombined }) => isReplyCombined && '20px'};
`;

export const ReplyTextWrapper = styled('div')`
  display: flex;
  align-content: center;
  padding-bottom: 8px;
`;

export const ReplyBoldText = styled('span')`
  ${({ theme }) => theme.Font.Text.xs.Medium};
  color: ${({ color }) => color};
`;

export const ReplyText = styled('span')`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ color }) => color};
`;

const DURATION = '0.2s';
const DROP_HEIGHT = '-15px';

const bounce = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(${DROP_HEIGHT});
  }
`;

export const MessageItemWrapper = styled('div')<{
  isCurrent?: boolean;
  isMine?: boolean;
}>`
  display: flex;
  flex-direction: column;
  ${({ isMine }) =>
    isMine &&
    css`
      align-items: flex-end;
    `};
  ${({ isCurrent }) =>
    isCurrent &&
    css`
      animation-name: ${bounce};
      animation-duration: ${DURATION};
      animation-direction: alternate;
      animation-iteration-count: 4;
    `}
`;

export const ParentMessageWrapper = styled('div')<{ isMine?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isMine }) =>
    isMine &&
    css`
      align-items: flex-end;
    `};
`;

export const MessageItem = styled('div')<{ isMine?: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
`;

export const MessageInfoWrapper = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const MessageMenu = styled('div')<{ isMine: boolean }>`
  position: absolute;
  right: ${({ isMine }) => (isMine ? 0 : 'unset')};
`;

export const MessageInfo = styled('div')<{ isMine: boolean }>`
  width: fit-content;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  margin: 0 4px;
  right: ${({ isMine }) => (isMine ? 0 : 'unset')};
`;

export const UnreadCount = styled('div')<{ color?: string }>`
  margin-bottom: 2px;
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ color }) => color};
`;

export const SendDate = styled('div')`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[500]};
  white-space: nowrap;
`;
