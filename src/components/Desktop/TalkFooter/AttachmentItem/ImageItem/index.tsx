import AttachmentItem, {
  AttachmentItemProps,
} from '@desktop/TalkFooter/AttachmentItem';

const ImageItem = (props: AttachmentItemProps) => {
  const { item, handleRemove } = props;
  return <AttachmentItem item={item} handleRemove={handleRemove} />;
};

export default ImageItem;
