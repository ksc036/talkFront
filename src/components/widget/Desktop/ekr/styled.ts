import { css, styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: transparent;
  position: relative;
`;

export const FavoriteDiv = styled.div`
  display: flex;
  margin-top: 24px;
  height: 68px;
`;

export const RoomListWrapper = styled('ul')<{ isSingleColumn?: boolean }>`
  height: 100%;
  overflow: scroll;
  display: grid;
  grid-template-columns: ${({ isSingleColumn }) =>
    isSingleColumn ? '1fr' : '1fr 1fr'};
  grid-auto-rows: 100px;
  gap: 8px;
  justify-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  min-height: 0;
  min-width: 0;

  ${({ isSingleColumn }) =>
    !isSingleColumn &&
    css`
      grid-auto-flow: dense;
      & > :nth-last-of-type(1):nth-of-type(odd) {
        grid-column: span 2;
      }
    `}
`;

export const RoomItemWrapper = styled('li')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  cursor: pointer;
  background: #f5f7f9;
  border-radius: 10px;
  min-width: 0;
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
  width: 100%;
  padding: 0 10px;
`;

export const NoRoomWrapper = styled('div')`
  height: 100%;
  padding: 0 14.5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NoRoomText = styled('strong')`
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const DimOverlay = styled('div')<{ dimOpacity: number }>`
  opacity: ${({ dimOpacity }) => dimOpacity};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
  pointer-events: none;
  transition: opacity 0.3s ease;
`;
