import { styled, Dialog, Button } from '@wapl/ui';

type ConfirmDialogButtonProps = {
  buttonColor?: string;
};

export const ConfirmDialog = styled(Dialog)`
  .MuiDialog-container {
    transition: unset !important;
  }
  .MuiDialog-paper {
    background-color: ${({ theme }) => theme.Color.Background[2]};
  }
`;

export const ConfirmDialogButtonWrapper = styled('div')`
  display: flex;
  gap: 12px;
  padding: 0 20px 20px 20px;
  button {
    flex: 1;
  }
`;

export const ConfirmDialogHeader = styled('div')`
  padding: 32px;
  text-align: center;
`;

export const ConfirmDialogTitle = styled('div')`
  ${({ theme: { Font } }) => Font.Text.l.Bold};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;

// 줄바꿈 등이 가능하도록 pre-line 설정
export const ConfirmDialogContent = styled('div')`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  line-height: 22px;
  color: ${({ theme: { Color } }) => Color.Gray[600]};
  margin-top: 10px;
  white-space: pre-line;
`;

export const ConfirmDialogDescription = styled('div')`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[600]};
  margin-top: 20px;
  white-space: pre-line;
`;

// 기본적으로 wapl ui버튼에는 white-space가 nowrap이라 버튼 텍스트가 길어지면 ... 처리됨
export const ConfirmDialogButton = styled(Button)<ConfirmDialogButtonProps>`
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  white-space: normal;
  background-color: ${({ buttonColor }) => `${buttonColor}`};
`;
