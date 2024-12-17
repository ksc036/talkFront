import { styled } from '@wapl/ui';

interface WrapperProps {
  isExpanded: boolean;
}

export const NoticeFloatingButton = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 14px;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

export const Overlay = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
  :active {
    background-color: ${({ theme }) => theme.Color.Black[10]};
  }
`;

export const Wrapper = styled('div')<WrapperProps>`
  z-index: 2;
  position: absolute;
  top: 4px;
  left: 8px;
  right: 8px;
  background: ${({ theme }) => theme.Color.Background[0]};
  border-radius: 6px;
`;

export const NoticeContent = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px 20px;
  cursor: pointer;
  gap: 12px;
`;

export const Notice = styled('div')`
  width: 100%;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin-top: 2px;
  display: flex;
  flex-direction: column;
`;

export const NoticedBy = styled('div')`
  ${({ theme }) => theme.Font.Text.s.Regular};
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
  height: 44px;
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
