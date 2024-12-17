import { CreateMessageDto } from '@/dto';
import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';
import { recoverHiddenRoom } from '@/utils';

const useSendMessage = (msg: CreateMessageDto, editorStore: EditorStore) => {
  const { messageStore, uiStore, emoticonStore } = useStore();

  const update = () => {
    if (msg.msgBody.sticker)
      emoticonStore.updateRecentEmoticons([msg.msgBody.sticker]);
  };

  const send = async (toDelete: string) => {
    if (!msg.msgType) return false;
    update();
    await recoverHiddenRoom(msg.targetRoomId);
    if (toDelete) await messageStore.deleteTempMessage({ messageId: toDelete });
    return await messageStore.createMessage(msg);
  };

  const clear = () => {
    editorStore.clear();
    messageStore.clearSticker();
    messageStore.clearReplyMessage();
    uiStore.setEmoticonModalVisible(false);
    setTimeout(() => {
      editorStore.setCursorEnd();
    }, 0);
  };

  return { send, clear };
};

export default useSendMessage;
