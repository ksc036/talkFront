import { styled } from '@wapl/ui';

export const ItemWrapper = styled('div')`
  height: 68px;
  padding: 0 8px;
  cursor: pointer;
  &:hover {
    background: #5782f60f;
  }
  &:focus,
  &:active {
    background: #5782f61a;
  }
`;

export const ItemDiv = styled('div')`
  padding: 14px 12px;
  display: flex;
`;

export const RoomInfoDiv = styled('div')`
  width: calc(100% - 52px);
  margin-left: 12px;
`;

export const CountText = styled('span')`
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: #9aa0a6;
  margin-left: 4px;
`;

export const RoomNameText = styled('h2')`
  color: #202124;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 0;
`;

export const MessageText = styled('p')`
  overflow: hidden;
  color: #80868b;
  text-overflow: ellipsis;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

export const TimeText = styled('span')`
  color: #9aa0a6;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
`;

export const UnreadCountText = styled('span')`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-align: center;
  padding: 1px 3.5px 1px 3.5px;
  background-color: #f44336;
  color: #ffffff;
  border-radius: 17px;
`;

export const RoomInfoTopDiv = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export const RoomNameCountDiv = styled('div')``;

export const RoomInfoBottomDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`;

export const MessageContent = styled('div')`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #80868b;
  text-overflow: ellipsis;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;

export const HashTagDiv = styled('div')`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #80868b;
  text-overflow: ellipsis;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;
