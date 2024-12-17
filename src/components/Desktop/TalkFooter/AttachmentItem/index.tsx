import React, { HtmlHTMLAttributes, useMemo } from 'react';

import { AttachmentItemModel } from '@/models';
import CancelButton from '@desktop/TalkFooter/AttachmentItem/CancelButton';

import * as S from './Styled';

export interface AttachmentItemProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  item: AttachmentItemModel;
  cancelButton?: React.ReactNode;
  handleRemove: (item: AttachmentItemModel) => void;
}

const AttachmentItem = (props: AttachmentItemProps) => {
  const {
    style,
    item,
    children,
    handleRemove,
    cancelButton = (
      <CancelButton item={item} onClick={() => handleRemove(item)} />
    ),
  } = props;
  const memoUrl = useMemo(() => item.url, []);
  return (
    <S.Wrapper style={style} url={memoUrl}>
      {cancelButton}
      {children}
    </S.Wrapper>
  );
};

export default AttachmentItem;
