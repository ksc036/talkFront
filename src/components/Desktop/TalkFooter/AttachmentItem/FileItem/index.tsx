import AttachmentItem, {
  AttachmentItemProps,
} from '@/components/Desktop/TalkFooter/AttachmentItem';
import * as S from '@desktop/TalkFooter/AttachmentItem/Styled';

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
