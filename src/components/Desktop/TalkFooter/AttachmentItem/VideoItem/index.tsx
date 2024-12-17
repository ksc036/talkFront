import { useTheme, Icon } from '@wapl/ui';

import AttachmentItem, {
  AttachmentItemProps,
} from '@desktop/TalkFooter/AttachmentItem';
import {
  IconWrapper,
  StyledVideo,
} from '@desktop/TalkFooter/AttachmentItem/VideoItem/Styled';

const VideoItem = (props: AttachmentItemProps) => {
  const { item, handleRemove } = props;
  const theme = useTheme();
  return (
    <AttachmentItem item={item} handleRemove={handleRemove}>
      {item.url && <StyledVideo src={item.url} />}
      <IconWrapper>
        <Icon.PlayFill width={37} height={37} color={theme.Color.Black[50]} />
      </IconWrapper>
    </AttachmentItem>
  );
};

export default VideoItem;
