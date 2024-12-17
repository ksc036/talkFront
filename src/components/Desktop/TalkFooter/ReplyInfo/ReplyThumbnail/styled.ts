import { styled } from '@wapl/ui';

export const ReplyEmoticonWrapper = styled('img')`
  width: 56px;
  height: 56px;
  margin-right: 16px;
`;

export const ReplyFileWrapper = styled('div')`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ReplyThumbnailWrapper = styled('div')`
  width: 56px;
  height: 56px;
  margin-right: 16px;
  position: relative;
`;

export const ReplyThumbnail = styled('img')`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
`;

export const PlayIconWrapper = styled('div')`
  width: 24px;
  height: 24px;
  position: absolute;
  top: calc(50% - 12px);
  left: calc(50% - 12px);
`;

export const InvalidFileThumbnail = styled('div')`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  background-color: ${({ theme }) => theme.Color.Gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
`;
