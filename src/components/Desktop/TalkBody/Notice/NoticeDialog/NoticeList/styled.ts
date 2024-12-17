import { styled, DialogHeader, DialogContent } from '@wapl/ui';

export const Header = styled(DialogHeader)`` as any;

export const Content = styled(DialogContent)`
  height: 100%;
  padding: 0 12px;
`;

export const NoticeListHeader = styled('div')`
  display: flex;
  align-items: center;
  padding: 8px 20px;
`;

export const HeaderText = styled('span')`
  margin-left: 12px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  width: 268px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NoticeCountWrapper = styled('div')`
  padding: 3px 20px 4px;
  height: 28px;
`;

export const NoticeCountText = styled('span')`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const NoticeCountNumber = styled('span')`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.Color.Gray[800]};
  margin-left: 4px;
`;

export const NoticeList = styled('div')`
  overflow: auto;
  overflow-y: scroll;
  height: 496px;

  ::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const NoticeItemWrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  &:active {
    background: rgba(0, 0, 0, 0.06);
  }
`;

export const NoticeItem = styled('div')`
  flex: 1 1 0%;
`;

export const NameText = styled('span')`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const TimeText = styled('span')`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.Color.Gray[600]};
  margin-left: 4px;
`;

export const ContentText = styled('div')`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 3px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
