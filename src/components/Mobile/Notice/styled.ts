import { Mui, styled } from '@wapl/ui';

export const NoticeFloatingButton = styled(Mui.IconButton)`
  position: absolute;
  top: 10px;
  right: 14px;
  width: 32px;
  height: 32px;
  padding: 6px;
  background: ${({ theme }) => theme.Color.Background[0]};
  box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

export const Wrapper = styled('div')<{ isExpanded: boolean }>`
  z-index: 100;
  position: absolute;
  left: 6px;
  right: 6px;
  top: 6px;
  background: ${({ theme }) => theme.Color.Background[0]};
  border-radius: 2px;
`;

export const NoticeContent = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 11px 12px;
  cursor: pointer;
  gap: 12px;
`;

export const Notice = styled('div')`
  width: 100%;
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin-top: 2px;
  display: flex;
  flex-direction: column;
`;

export const NoticedBy = styled('div')`
  color: ${({ theme }) => theme.Color.Gray[600]};
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ExpandButton = styled('button')`
  width: 20px;
  height: 20px;
  border: 0;
  padding: 0;
  background: transparent;
`;

export const ExpandedContent = styled('div')`
  height: 36px;
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.Color.Gray[200]};
`;

export const UserNameText = styled('span')`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const CollapseButton = styled('button')`
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  font-weight: 400;
  font-size: 13px;
  background: transparent;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;
