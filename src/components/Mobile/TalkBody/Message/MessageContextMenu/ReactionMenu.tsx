import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

const ReactionMenu = observer(() => {
  const { messageStore, reactionStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const navigate = useNavigate();

  const myId = userStore.selectedPersona?.id as number;

  const handleClose = () => {
    messageStore.setHoveredMessageId(-1);
    navigate(-1);
  };
  const onClickEmoji = (emojiKey: string) => async () => {
    if (messageStore.isScrollBottom) {
      messageStore.scrollToBottom('auto');
    }

    const roomId = roomStore.currentRoomId as number;
    const messageId = messageStore.hoveredMessageId;
    if (!reactionStore.hasMyReaction(myId, messageId, emojiKey)) {
      await reactionStore.createReaction({
        targetType: 'message',
        targetId: messageId,
        reactionName: emojiKey,
        roomId,
      });
    }
    handleClose();
  };

  return (
    <S.ReactionMenuWrapper>
      <S.EmojiList>
        {reactionStore.reactions.emoticons.map((emoticon) => (
          <S.EmojiItem
            key={emoticon.key}
            src={emoticon.thumbnail}
            onClick={onClickEmoji(emoticon.key)}
          />
        ))}
      </S.EmojiList>
    </S.ReactionMenuWrapper>
  );
});

export default ReactionMenu;
