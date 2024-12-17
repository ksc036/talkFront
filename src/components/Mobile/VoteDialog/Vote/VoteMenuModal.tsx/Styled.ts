import { styled, ContextMenu } from '@wapl/ui';

export const ListItemText = styled('span')`
  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const StyledContextMenu = styled(ContextMenu)`
  z-index: 1500;
`;
