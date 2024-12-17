import { Button, styled } from '@wapl/ui';

export const Wrapper = styled('div')<{
  width?: number | string;
  height?: number | string;
}>`
  box-sizing: border-box;
  width: ${({ width }) =>
    width ? (typeof width === 'string' ? width : `${width}px`) : '300px'};
  height: ${({ height }) =>
    height ? (typeof height === 'string' ? height : `${height}px`) : '424px'};
  border: 1px solid #e8eaed;
  border-radius: 10px;
  padding: 10px 0;
`;

export const Header = styled('div')`
  height: 20px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled('h1')`
  ${({ theme: { Font } }) => Font.Text.l.Bold};
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin: 0;
`;

export const MoreButtonWrapper = styled('div')`
  display: flex;
  cursor: pointer;
`;

export const MoreText = styled('span')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  :hover {
    color: ${({ theme }) => theme.Color.Gray[700]};
  }
  :active {
    ${({ theme: { Font } }) => Font.Text.s.Medium};
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
`;

export const RoomListWrapper = styled('ul')`
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const RoomItemWrapper = styled('li')`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  :hover {
    background: #0000000a;
  }
  :active {
    background: #0000000f;
  }
`;

export const Profile = styled('div')`
  position: relative;
  height: 48px;
  width: 48px;
`;

export const RoomImg = styled('img')`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
`;

export const RoomInfoWrapper = styled('div')`
  margin-left: 12px;
  overflow: hidden;
`;

export const RoomInfo = styled('div')`
  display: flex;
  align-items: center;
  svg + span {
    margin-left: 4px;
  }
`;

export const RoomName = styled('span')`
  ${({ theme: { Font } }) => Font.Text.m.Medium};
  color: ${({ theme }) => theme.Color.Gray[900]};
  text-overflow: ellipsis;
  overflow: auto;
`;

export const RoomCount = styled('span')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: #fb4516;
  margin-left: 4px;
  max-width: 24px;
`;

export const RoomTagWrapper = styled('div')`
  margin-top: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RoomTag = styled('span')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[700]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NoRoomWrapper = styled('div')`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NoRoomText = styled('strong')`
  ${({ theme: { Font } }) => Font.Text.m.Medium};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const NoRoomSubText = styled('div')`
  margin-top: 8px;
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const NoRoomButton = styled(Button)`
  height: 48px;
  width: 100%;
  margin-top: 24px;
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  background: ${({ theme }) => theme.Color.White[100]};
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  &:hover {
    background: ${({ theme }) => theme.Color.White[100]};
  }
`;
