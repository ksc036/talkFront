import { CreateMessageDto } from '@/dto';
import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';

const getType = ({
  parsedText,
  selectedSticker,
  ogUrl,
  isFormatted,
}: {
  parsedText?: string;
  selectedSticker?: string;
  ogUrl?: string | null;
  isFormatted?: boolean;
}) => {
  let type = 0;
  if (parsedText) type += 1;
  //   let media = 4;// 이미지/동영상
  if (selectedSticker) type += 8;
  if (ogUrl) type += 128;
  if (isFormatted) type += 16384;
  return type;
};

const useMessageFormatter = (
  editorStore: EditorStore,
  targetRoomId: number,
  nick: string,
  roomName: string,
  isFormatted?: boolean,
): CreateMessageDto => {
  const { messageStore, emoticonStore, talkStore } = useStore();
  const { appId } = talkStore;
  const { parsedText, rawText, ogUrl, mention } = editorStore.parseContent();

  const selectedSticker = emoticonStore.selectedSticker;
  const replyMessage = messageStore.replyMessage;

  const type = getType({ parsedText, selectedSticker, ogUrl, isFormatted });

  // msgBody
  const msgBody = {};
  if (!isFormatted && parsedText)
    Object.assign(msgBody, { content: parsedText });
  if (isFormatted) Object.assign(msgBody, { content: editorStore.content });
  if (ogUrl) Object.assign(msgBody, { ogUrl: ogUrl });
  if (mention?.length) Object.assign(msgBody, { mention: mention });
  if (selectedSticker) Object.assign(msgBody, { sticker: selectedSticker });

  // dto
  const dto = {
    msgType: type,
    msgBody: msgBody,
    targetRoomId: targetRoomId,
    nick: nick,
    roomName: roomName,
    appId: appId,
  };
  if (replyMessage) {
    Object.assign(dto, { parentId: replyMessage.msgId });
  }
  if (rawText) Object.assign(dto, { rawContent: rawText });
  return dto;
};

export default useMessageFormatter;
