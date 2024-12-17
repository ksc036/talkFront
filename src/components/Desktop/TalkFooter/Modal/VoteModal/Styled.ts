import { styled, Dialog } from '@wapl/ui';

type VoteModalProps = {
  isMini: boolean;
};

export const VoteModal = styled(Dialog)<VoteModalProps>`
  .MuiDialog-container {
    transition: unset !important;
  }

  .MuiDialog-paper {
    border-radius: ${({ isMini }) => isMini && '0px'};
  }
`;

export const DialogWrapper = styled('div')`
  height: 680px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;
