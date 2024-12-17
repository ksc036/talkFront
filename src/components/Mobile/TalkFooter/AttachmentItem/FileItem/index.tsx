import * as S from '@desktop/TalkFooter/AttachmentItem/Styled';

import AttachmentItem, { AttachmentItemProps } from '..';

const FileItem = (props: AttachmentItemProps) => {
  const { item, handleRemove } = props;
  return (
    <AttachmentItem item={item} handleRemove={handleRemove}>
      {item.icon}
      <S.ItemTitle>{item.name}</S.ItemTitle>
      <S.ItemInfo>{item.formattedSize}</S.ItemInfo>
    </AttachmentItem>
  );
};

export default FileItem;
