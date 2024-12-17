import { useCoreStore } from '@wapl/core';

import PlainMessage from '@/components/Common/Message/MessageItem/PlainMessage';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { getHTMLStringText } from '@/utils/editor';
import * as T from '@types';

import * as S from './Styled';

interface ReplyContentsProps {
  targetMessage: MessageModel;
}

const typeMap: Record<T.MessageType, string> = {
  text: '텍스트',
  file: '파일',
  image: '이미지',
  sticker: '이모티콘',
  vote: '투표',
  notice: '공지',
  autoMsg: '자동 메시지',
  url: 'URL',
  meeting: '미팅',
  contact: '연락처',
  mail: '메일',
  video: '동영상',
  bot: '봇',
  calendar: '캘린더',
  editor: '에디터',
};

const getReplyBody = (targetMessage: MessageModel) => {
  if (targetMessage.msgType.includes('editor')) {
    return (
      <PlainMessage
        msgId={targetMessage.msgId}
        content={getHTMLStringText(targetMessage.content)}
        getShort={true}
        allowKeywordSearch={false}
      />
    );
  } else if (
    targetMessage.msgType.includes('text') ||
    targetMessage.isRoomShareLink
  )
    return (
      <PlainMessage
        msgId={targetMessage.msgId}
        content={targetMessage.content}
        getShort={true}
        allowKeywordSearch={false}
      />
    );
  else if (targetMessage.msgType.includes('editor'))
    return (
      <PlainMessage
        msgId={targetMessage.msgId}
        content={targetMessage.rawContent}
        getShort={true}
        allowKeywordSearch={false}
      />
    );
  return typeMap[targetMessage.msgType[0]];
};

const ReplyContents = (props: ReplyContentsProps) => {
  const { targetMessage } = props;
  const { personaStore } = useCoreStore();
  const { configStore } = useStore();
  return (
    <S.Wrapper>
      <S.ReplyTitle>
        <S.ReplyName color={configStore.InputMessageStyle.ReplyNameColor}>
          {personaStore.personaMap.get(targetMessage.personaId)?.nick ?? ''}
          <span>에게 답장</span>
        </S.ReplyName>
      </S.ReplyTitle>
      <S.ReplyBody color={configStore.InputMessageStyle.ReplyToColor}>
        {getReplyBody(targetMessage)}
      </S.ReplyBody>
    </S.Wrapper>
  );
};

export default ReplyContents;
