import { styled, Dialog, Button } from '@wapl/ui';

export const ConfirmDialog = styled(Dialog)`
  .MuiDialog-container {
    transition: unset !important;
  }
`;

export const ConfirmDialogButtonWrapper = styled('div')`
  display: flex;
  gap: 8px;
  padding: 16px 20px 20px;
  button {
    flex: 1;
  }
  background-color: ${({ theme: { Color } }) => Color.Background[2]};
`;

export const ConfirmDialogHeader = styled('div')`
  padding: 24px 16px 4px;
  text-align: center;
  background-color: ${({ theme: { Color } }) => Color.Background[2]};
`;

export const ConfirmDialogTitle = styled('div')`
  ${({ theme: { Font } }) => Font.Text.l.Bold};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;

// 줄바꿈 등이 가능하도록 pre-line 설정
export const ConfirmDialogContent = styled('div')`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  margin-top: 10px;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const ConfirmDialogDescription = styled('div')`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[600]};
  margin-top: 20px;
  white-space: pre-line;
`;

// 기본적으로 wapl ui버튼에는 white-space가 nowrap이라 버튼 텍스트가 길어지면 ... 처리됨
export const ConfirmDialogButton = styled(Button)`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  white-space: normal;
  min-width: 120px;
  padding: 10px;
`;
