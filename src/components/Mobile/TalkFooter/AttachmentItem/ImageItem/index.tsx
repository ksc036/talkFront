import AttachmentItem, { AttachmentItemProps } from '..';

import * as S from './Styled';

const ImageItem = (props: AttachmentItemProps) => {
  const { item, handleRemove } = props;

  return (
    <AttachmentItem item={item} handleRemove={handleRemove}>
      {item.url && <S.ImageThumbnail src={item.url as string} />}
    </AttachmentItem>
  );
};

export default ImageItem;
