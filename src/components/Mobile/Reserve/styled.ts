import { styled, FullScreenDialog } from '@wapl/ui';

export const ReserveDialog = styled(FullScreenDialog)``;

export const DialogWrapper = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;
