import { useState } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import { useStore } from '@/stores';

import * as S from './styled';

const LinkDrawerFooter = observer(() => {
  const { linkStore, configStore, uiStore } = useStore();
  const { userStore } = useCoreStore();
  const { Color } = useTheme();

  const [showDeleteUnableDialog, setShowDeleteUnableDialog] =
    useState<boolean>(false);

  const handleDeleteButtonClick = () => {
    const checkedLinksPersonaIds = [
      ...new Set(
        linkStore.checkedLinks.map((checkedLink) => checkedLink.personaId),
      ),
    ];

    if (
      checkedLinksPersonaIds.length === 1 &&
      userStore.selectedPersona?.id === checkedLinksPersonaIds[0]
    ) {
      uiStore.openDialog('confirmLinkDelete');
    } else {
      setShowDeleteUnableDialog(true);
    }
  };

  const handleCancelButtonClick = () => {
    setShowDeleteUnableDialog(false);
  };

  const handleClearLinksButtonClick = () => {
    linkStore.clearCheckedLinks();
  };

  return (
    <>
      <S.LinkDrawerFooterWrapper>
        <S.CheckedLinksNumberText>
          {linkStore.checkedLinks.length}개 선택
        </S.CheckedLinksNumberText>

        <S.UncheckAllButton
          onClick={handleClearLinksButtonClick}
          textColor={configStore.MainColor}
          disabled={linkStore.checkedLinks.length === 0}
        >
          선택 해제
        </S.UncheckAllButton>

        <S.IconWrapper
          onClick={handleDeleteButtonClick}
          disabled={linkStore.checkedLinks.length === 0}
        >
          <Icon.DeleteLine
            width={20}
            height={20}
            color={
              linkStore.checkedLinks.length === 0
                ? Color.Gray[500]
                : Color.Gray[900]
            }
          />
        </S.IconWrapper>
      </S.LinkDrawerFooterWrapper>

      <ConfirmDialog
        open={showDeleteUnableDialog}
        title="링크 삭제 실패"
        description={'내가 생성한 링크만 삭제할 수 있습니다.'}
        onClickOk={handleCancelButtonClick}
      />
    </>
  );
});
export default LinkDrawerFooter;
