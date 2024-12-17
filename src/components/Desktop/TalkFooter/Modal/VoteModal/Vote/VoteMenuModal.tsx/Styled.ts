import { Mui, styled } from '@wapl/ui';

export const PaperStyle = {
  width: '160px',
  borderRadius: '12px',
  boxShadow: '0px 0px 8px 0px #00000033',
};

export const ListItemWrapper = styled(Mui.MenuItem)`
  height: 36px;
  padding: 0px 20px;
  display: flex;
  gap: 8px;
`;

export const ListItemText = styled('span')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;
