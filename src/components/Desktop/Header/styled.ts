import { Icon, styled } from '@wapl/ui';

type HeaderWrapperProps = {
  headerVisible?: boolean;
};

type RoomInfoWrapperProps = {
  clickable?: boolean;
};

type RoomMemberCountProps = {
  color: string;
};

export const HeaderWrapper = styled('div')<HeaderWrapperProps>`
  display: ${({ headerVisible }) => !headerVisible && 'none'};
`;

export const Header = styled('header')`
  width: 100%;
  height: 62px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const RoomInfoWrapper = styled('div')<RoomInfoWrapperProps>`
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 0 1 auto;
  cursor: ${({ clickable }) => clickable && 'pointer'};
`;

export const RoomProfileWrapper = styled('div')`
  display: flex;
  align-items: center;
  margin: 0px;
  margin-right: 12px;
`;

export const MeFillIcon = styled(Icon.MeFill)`
  margin-right: 6px;
`;

export const RoomTypeIcon = styled('div')<{ color?: string }>`
  height: 22px;
  ${({ theme }) => theme.Font.Text.m.Medium};
  border-radius: 4px;
  margin-right: 4px;
  padding: 0px 4px;
  color: ${({ color }) => color};
  background-color: #e5eeff66;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RoomName = styled('strong')`
  ${({ theme: { Font } }) => Font.Text.l.Bold};
  font-weight: 500;
  height: 20px;
  line-height: 20px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 0 1 auto;
`;

export const RoomMemberCount = styled('p')<RoomMemberCountProps>`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  font-weight: 500;
  height: 20px;
  line-height: 20px;
  color: ${({ color }) => color};
  margin-left: 6px;
  margin-right: 8px;
`;

export const HeaderIconsSearchBarWrapper = styled('div')`
  display: flex;
  gap: 12px;
`;

export const HeaderIconsWrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const KeywordSearchButton = styled('button')<{ hasText: boolean }>`
  ${({ hasText }) =>
    hasText
      ? 'width: 48px; height: 50px; border-radius: 8px;'
      : 'width: 28px; height: 28px; border-radius: 50%;'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: none;
  border: 0;
  padding: 0;
  gap: 3px;
  margin-left: -4px;
  margin-right: -4px;
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[700]};

  :hover {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }
`;

export const Splitter = styled('span')<{ hasText: boolean }>`
  width: 1px;
  height: ${({ hasText }) => (hasText ? '38px' : '28px')};
  background-color: ${({ theme }) => theme.Color.Gray[400]};
  margin-left: ${({ hasText }) => (hasText ? '0px' : '4px')};
  margin-right: ${({ hasText }) => (hasText ? '0px' : '4px')};
`;
