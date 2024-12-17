import { useTheme, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { checkDevice } from '@/utils';

import AttachmentItem, { AttachmentItemProps } from '..';

import * as S from './Styled';

const VideoItem = observer((props: AttachmentItemProps) => {
  const { item, handleRemove } = props;
  const theme = useTheme();

  return (
    <AttachmentItem item={item} handleRemove={handleRemove}>
      {checkDevice() === 'Android'
        ? item.url && <S.VideoThumbnail src={item.url} autoPlay muted />
        : item.url && <S.ImageThumbnail src={item.url} />}

      <S.IconWrapper>
        <Icon.PlayFill width={37} height={37} color={theme.Color.Black[50]} />
      </S.IconWrapper>
    </AttachmentItem>
  );
});

export default VideoItem;
