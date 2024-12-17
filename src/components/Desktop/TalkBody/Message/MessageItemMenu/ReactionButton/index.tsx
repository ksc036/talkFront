import { useCoreStore } from '@wapl/core';
import { Icon, useTheme, Tooltip } from '@wapl/ui';

import { useStore } from '@/stores';

import * as S from './styled';

interface ReactionButtonProps {
  messageId: number;
  anchorEl: null | HTMLDivElement;
  openEmojiMenu: () => void;
  closeEmojiMenu: () => void;
  menuType: string;
  isMine: boolean;
}

const ReactionButton = (props: ReactionButtonProps) => {
  const {
    messageId,
    anchorEl,
    openEmojiMenu,
    closeEmojiMenu,
    menuType,
    isMine,
  } = props;

  const theme = useTheme();
  const { reactionStore, messageStore, configStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const myId = userStore.selectedPersona?.id as number;

  const handleClose = () => {
    closeEmojiMenu();
    messageStore.setHoveredMessageId(-1);
  };

  const onClickEmoji = (emojiKey: string) => async () => {
    if (messageStore.isScrollBottom) {
      messageStore.scrollToBottom('auto');
    }

    const roomId = roomStore.currentRoomId as number;
    if (!reactionStore.hasMyReaction(myId, messageId, emojiKey)) {
      await reactionStore.createReaction({
        targetType: 'message',
        targetId: messageId,
        reactionName: emojiKey,
        roomId,
      });
    } else {
      const reactionId = reactionStore.getReactionId(myId, messageId, emojiKey);
      if (reactionId) {
        await reactionStore.deleteReaction({ reactionId, roomId });
      }
    }
    handleClose();
  };

  const open = Boolean(anchorEl) && menuType === 'Emoji';

  const isMyReaction = (emojiKey: string) => {
    return reactionStore.hasMyReaction(myId, messageId, emojiKey);
  };

  return (
    <>
      <Tooltip
        title="공감"
        sx={{
          '.MuiTooltip-tooltip': {
            color: theme.Color.Background[0],
            backgroundColor: theme.Color.Gray[900],
          },
        }}
      >
        <S.ReactionButton onClick={openEmojiMenu}>
          <Icon.Emoji1Line
            width={20}
            height={20}
            color={configStore.MessageMenuStyle.IconColor}
          />
        </S.ReactionButton>
      </Tooltip>
      <S.ReactionMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={
          isMine
            ? {
                vertical: 40,
                horizontal: 'left',
              }
            : {
                vertical: 40,
                horizontal: 'right',
              }
        }
        transformOrigin={
          isMine
            ? {
                vertical: 'top',
                horizontal: 130,
              }
            : {
                vertical: 'top',
                horizontal: 64,
              }
        }
      >
        <S.EmojiList>
          {reactionStore.reactions.emoticons.map((emoticon) => (
            <S.EmojiItem
              isMine={isMyReaction(emoticon.key)}
              key={emoticon.key}
              onClick={onClickEmoji(emoticon.key)}
            >
              <img src={emoticon.thumbnail} width={20} height={20} />
            </S.EmojiItem>
          ))}
        </S.EmojiList>
      </S.ReactionMenu>
    </>
  );
};

export default ReactionButton;
