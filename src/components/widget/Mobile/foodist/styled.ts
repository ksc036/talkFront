import { Button, styled } from '@wapl/ui';

export const Wrapper = styled('div')``;

export const HeaderWrapper = styled('div')`
  height: 32px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TitleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const SubTitle = styled('span')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const Title = styled('h1')`
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: #00cb76;
  margin: 0;
`;

export const RightSide = styled('div')`
  display: flex;
`;

export const MoreText = styled('span')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  margin-right: 8px;
`;

export const RoomListWrapper = styled('ul')`
  display: flex;
  overflow-x: scroll;
  padding: 0 16px 16px;
  margin: 0;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const RoomItemWrapper = styled('li')`
  box-sizing: border-box;
  width: 120px;
  min-width: 120px;
  height: 200px;
  position: relative;
  border: 1px solid ${({ theme }) => theme.Color.Gray[200]};
  border-radius: 6px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  &:last-of-type {
    margin-right: 0;
  }
`;

export const LiveImg = styled('img')`
  width: 32px;
  height: 18px;
  position: absolute;
  right: 8px;
  top: 8px;
`;

export const StartImg = styled('div')`
  width: 20px;
  height: 20px;
`;

export const RoomImg = styled('img')`
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 6px 6px;
  object-fit: cover;
`;

export const RoomInfoWrapper = styled('div')`
  width: calc(100% - 16px);
  height: 36px;
  border-top: 1px solid ${({ theme }) => theme.Color.Gray[200]};
  bottom: 0;
  left: 0;
  position: absolute;
  background-color: ${({ theme }) => theme.Color.Gray[50]};
  border-radius: 0 0 5px 5px;
  padding: 4px 8px 8px 8px;
`;

export const RoomInfoRow = styled('div')`
  display: flex;
  align-items: center;
  &:last-of-type {
    margin-top: 4px;
  }
`;

export const RoomName = styled('span')`
  ${({ theme: { Font } }) => Font.Text.xxs.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  margin-left: 4px;
`;

export const AdminName = styled('span')`
  ${({ theme: { Font } }) => Font.Text.xxxs.Regular};
  color: ${({ theme }) => theme.Color.Gray[500]};
  margin-right: 4px;
  max-width: 66px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`;

export const RoomUserCount = styled('span')`
  ${({ theme: { Font } }) => Font.Text.xxxs.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  margin-left: 4px;
  max-width: 18px;
  overflow: hidden;
  white-space: nowrap;
  /* text-overflow: ellipsis; */
  word-break: break-all;
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
