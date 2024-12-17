import { styled } from '@wapl/ui';

export const Wrapper = styled('div')<{ isMine: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
`;

export const MessageWrapper = styled('div')<{
  isMine: boolean;
  isHead: boolean;
}>`
  box-sizing: border-box;
  max-width: max(270px, 75%);
  padding: ${({ isMine, isHead }) =>
    isMine
      ? isHead
        ? '8px 20px 8px 0px'
        : '0 20px 8px 0px'
      : isHead
      ? '8px 0px 8px 20px'
      : '0 0px 8px 20px'};
`;

export const MessageHoverWrapper = styled('div')`
  display: flex;
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
