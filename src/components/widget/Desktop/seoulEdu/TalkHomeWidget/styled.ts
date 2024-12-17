import { styled } from '@wapl/ui';

export const Wrapper = styled('div')<{
  width?: number | string;
  height?: number | string;
}>`
  box-sizing: border-box;
  width: ${({ width }) =>
    width ? (typeof width === 'string' ? width : `${width}px`) : '494px'};
  height: ${({ height }) =>
    height ? (typeof height === 'string' ? height : `${height}px`) : '100%'};
  background: transparent;
`;

export const Header = styled('div')`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderTitleSpan = styled.span`
  display: flex;
  align-items: center;
`;

export const Title = styled('h2')`
  margin: 0;
  font-family: Spoqa Han Sans Neo;
  font-size: 16px;
  font-weight: 500;
  color: #191919;
  margin-left: 8px;
`;

export const ContentDiv = styled.div`
  display: flex;
  height: calc(100% - 172px);
  gap: 20px;
`;

export const RoomDiv = styled.div<{ backGroundColor?: string }>`
  width: 100%;
  border-radius: 10px;
  gap: 10px;
  background: ${({ backGroundColor }) => backGroundColor ?? '#f7faff'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RoomInfoText = styled.h3`
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  color: #3663f6;
  font-size: 14px;
  font-weight: 400;
  margin: 20px 0 0 0;
`;

export const FavoriteDiv = styled.div`
  margin-top: 24px;
  height: 152px;
  padding: 20px;
  border-radius: 10px;
  background: #f5f7f9;
`;

export const FavoriteTitleDiv = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
`;

export const FavoriteTitle = styled.b`
  margin-left: 4px;
  font-family: Spoqa Han Sans Neo;
  font-size: 16px;
  font-weight: 500;
  color: #191919;
`;

export const FavoriteRoomListDiv = styled.div`
  width: 100%;
  padding: 23px 21px;
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
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0px;
  justify-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const RoomItemWrapper = styled('li')`
  width: 40px;
  cursor: pointer;
`;

export const RoomInfo = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RoomImg = styled('img')`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
`;

export const RoomName = styled.h3`
  margin: 8px 0 0 0;
  font-family: Spoqa Han Sans Neo;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  color: ${({ theme }) => theme.Color.Gray[600]};
`;
