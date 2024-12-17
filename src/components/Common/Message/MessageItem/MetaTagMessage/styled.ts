import { styled } from '@wapl/ui';

export const NotiWrapper = styled('div')<{
  isReply?: boolean;
  minHeight?: number;
}>`
  opacity: ${({ isReply }) => (isReply ? '50%' : 'unset')};
  width: 240px;
  min-height: ${({ minHeight }) => minHeight ?? 0};
  padding-bottom: ${({ isReply }) => (isReply ? '8px' : 'unset')};
`;

export const NotiBody = styled('div')<{
  hasBottom: boolean;
  isMobile?: boolean;
  color?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: ${({ color }) => color};
  border-radius: ${({ hasBottom, isMobile }) =>
    !hasBottom
      ? isMobile
        ? '8px'
        : '16px'
      : isMobile
      ? '8px 8px 0px 0px'
      : '16px 16px 0px 0px'};
  padding: 12px;
`;

export const NotiInfoText = styled('strong')<{ color: string }>`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ color }) => color};
`;

export const NotiTitleText = styled('div')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 4px;
`;

export const NotiBottom = styled('div')<{
  color?: string;
  isMobile?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  background: ${({ color }) => color};
  border-radius: ${({ isMobile }) =>
    isMobile ? '0px 0px 8px 8px' : '0px 0px 16px 16px'};
  padding: 8px 12px;
`;

export const Overlay = styled('div')<{ isMobile?: boolean; isReply?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: ${({ isMobile }) =>
    isMobile ? '0px 0px 8px 8px' : '0px 0px 16px 16px'};
  :hover {
    background-color: ${({ theme, isReply }) =>
      isReply ? '' : theme.Color.Black[4]};
  }
  :active {
    background-color: ${({ theme, isReply }) =>
      isReply ? '' : theme.Color.Black[10]};
  }
  cursor: ${({ isReply }) => (isReply ? 'auto' : 'pointer')};
`;

export const NotiBottomText = styled('strong')`
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: auto;
  margin-left: 8px;
`;
