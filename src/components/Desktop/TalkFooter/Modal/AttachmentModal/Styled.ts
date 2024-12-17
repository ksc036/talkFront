import { styled } from '@wapl/ui';

export const PaperStyle = {
  width: '160px',
  borderRadius: '8px',
  boxShadow: '0px 0px 8px 0px 0.2',
};

export const ListItemText = styled('div')`
  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;
