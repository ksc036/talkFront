import { Mui, styled } from '@wapl/ui';

export const PaperStyle = {
  width: '260px',
  maxHeight: '460px',
  minHeight: '68px',
  borderRadius: '12px',
  '&::-webkit-scrollbar': {
    width: 4,
  },

  '&::-webkit-scrollbar-track-piece': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 4,
    backgroundColor: '#BDC1C6',
  },
};

export const ListItem = styled(Mui.MenuItem)`
  width: 100%;
  height: 52px;
  gap: 12px;
`;

export const ListItemText = styled('span')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const RoomMenuItemsWrapper = styled('ul')`
  list-style: none;
  padding: 0 0 0 0;
  margin: 6px 8px 0px 8px;
  background-color: ${({ theme }) => theme.Color.White[100]};
`;
