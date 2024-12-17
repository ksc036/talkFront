import { styled, Dialog } from '@wapl/ui';

type NoticeDialogProps = {
  isMini: boolean;
};

export const NoticeDialog = styled(Dialog)<NoticeDialogProps>`
  .MuiDialog-container {
    transition: unset !important;
  }
  .MuiPaper-root {
    height: 680px;
    width: 460px;
    position: relative;
    background-color: ${({ theme }) => theme.Color.Background[0]};
  }

  .MuiDialog-paper {
    border-radius: ${({ isMini }) => isMini && '0px'};
  }
`;

export const AddButton = styled('button')`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  background: none;
  border: 0;
  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.2));
  &:hover {
    background: none;
  }
`;
