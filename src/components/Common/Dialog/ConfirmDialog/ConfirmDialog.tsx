import { Mui } from '@wapl/ui';

import CommonButton from '@/components/Common/Button';

import * as S from './styled';

interface ConfirmDialogProps extends Mui.DialogProps {
  open: boolean;
  title?: string;
  htmlElement?: JSX.Element;
  content?: string;
  description?: string;
  onClickBackDrop?: () => void;
  onClickCancel?: () => void;
  onClickOk?: () => void;
  cancelText?: string;
  okText?: string;
  isOkNegative?: boolean;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    open,
    title,
    htmlElement,
    content,
    description,
    onClickBackDrop,
    onClickCancel,
    onClickOk,
    cancelText = '취소',
    okText = '확인',
    isOkNegative = false,
    ...rest
  } = props;

  return (
    <S.ConfirmDialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' && onClickBackDrop) {
          onClickBackDrop();
        } else if (onClickCancel) {
          onClickCancel();
        }
      }}
      {...rest}
    >
      <S.ConfirmDialogHeader>
        <S.ConfirmDialogTitle>{title}</S.ConfirmDialogTitle>
        {htmlElement}
        {content && <S.ConfirmDialogContent>{content}</S.ConfirmDialogContent>}
        {description && (
          <S.ConfirmDialogDescription>{description}</S.ConfirmDialogDescription>
        )}
      </S.ConfirmDialogHeader>
      <S.ConfirmDialogButtonWrapper>
        {onClickCancel && (
          <CommonButton
            size="large"
            variant="secondary"
            onClick={onClickCancel}
          >
            {cancelText}
          </CommonButton>
        )}
        {onClickOk && (
          <CommonButton
            size="large"
            variant={isOkNegative ? 'negative' : undefined}
            onClick={onClickOk}
          >
            {okText}
          </CommonButton>
        )}
      </S.ConfirmDialogButtonWrapper>
    </S.ConfirmDialog>
  );
};
