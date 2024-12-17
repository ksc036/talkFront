import { styled } from '@wapl/ui';

type FileWrapperProps = {
  isHover: boolean;
  isReply?: boolean;
};

type IconWrapperProps = {
  isHover: boolean;
};

export const FileWrapper = styled('div')<FileWrapperProps>`
  opacity: ${({ isReply }) => (isReply ? '50%' : 'unset')};
  cursor: ${({ isHover }) => `${isHover ? 'pointer' : ''}`};
  background: ${({ theme }) => theme.Color.White[100]};
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  border-radius: 8px;
  display: flex;
  box-sizing: border-box;
  width: 200px;
  height: 52px;
  left: 0px;
  top: calc(50% - 52px / 2);
  margin-bottom: ${({ isReply }) => (isReply ? '8px' : 'unset')};
  overflow: hidden;
`;

export const IconWrapper = styled('span')<IconWrapperProps>`
  cursor: ${({ isHover }) => `${isHover ? 'pointer' : ''}`};
  background: ${({ isHover, theme }) =>
    `${isHover ? theme.Color.Gray[100] : ''}`};
  border-radius: ${({ isHover }) => `${isHover ? '50%' : ''}`};
  padding: 14px 12px 14px 12px;
`;

export const FileInfoWrapper = styled('span')`
  width: 156px;
  padding: 8px 12px 8px 0;
`;

export const FileName = styled('strong')`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  width: 143px;
  height: 18px;

  display: block;

  order: 0;

  max-width: 143px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const FileSize = styled('small')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  width: 39px;
  height: 16px;

  flex: none;
  order: 1;
  flex-grow: 0;
`;
