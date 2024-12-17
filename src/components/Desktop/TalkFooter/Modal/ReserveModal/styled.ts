import { styled, Dialog } from '@wapl/ui';

export const ReserveModal = styled(Dialog)`
  .MuiDialog-container {
    transition: unset !important;
  }
`;

export const DialogWrapper = styled('div')`
  height: 680px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;
