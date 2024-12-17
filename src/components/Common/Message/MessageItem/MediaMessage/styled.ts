import { styled } from '@wapl/ui';

type MediaWrapperProps = {
  isHover?: boolean;
};

type MediaProps = {
  isReply?: boolean;
  width: number;
  height: number;
};

type InvalidMediaWrapperProps = {
  isReply?: boolean;
  width: number;
  height: number;
};

export const Wrapper = styled('div')<{ isReply?: boolean }>`
  padding-bottom: ${({ isReply }) => (isReply ? '8px' : 'unset')};
`;

export const MediaWrapper = styled('div')<MediaWrapperProps>`
  position: relative;
  cursor: ${({ isHover }) => isHover && 'pointer'};
`;

export const Media = styled('img')<MediaProps>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  opacity: ${({ isReply }) => (isReply ? '50%' : 'unset')};
  background: ${({ theme }) => theme.Color.White[100]};
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  border-radius: 8px;
  display: flex;
  box-sizing: border-box;
  left: 0px;
  top: calc(50% - 52px / 2);
  overflow: hidden;
  object-fit: cover;
`;

export const PlayIconWrapper = styled('div')<{ isReply?: boolean }>`
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  cursor: pointer;

  &:hover {
    svg > g > circle {
      fill: ${({ isReply }) => (!isReply ? 'rgba(0, 0, 0, 0.4)' : '')};
    }
  }
`;

export const InvalidMediaWrapper = styled('div')<InvalidMediaWrapperProps>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  opacity: ${({ isReply }) => (isReply ? '70%' : 'unset')};
  border-radius: 8px;
  cursor: ${({ isReply }) => (isReply ? 'pointer' : 'default')};
`;
