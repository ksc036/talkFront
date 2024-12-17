import { useMemo, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDocsStore } from '@tmaxoffice/docs';
import { PersonaModel, RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { Observer, observer, useObserver } from 'mobx-react';

// import TalkBody from '../TalkBody';

import Mention from '@/components/Mobile/TalkFooter/TalkFooterItems/Mention';
import Open from '@/components/Mobile/TalkFooter/TalkFooterItems/Open';
import TalkQuill from '@/components/Mobile/TalkFooter/TalkQuill';
import useMessageFormatter from '@/hooks/useMessageFormatter';
import { useQuillMention } from '@/hooks/useQuillMention';
import useSendAttach from '@/hooks/useSendAttach';
import useSendMessage from '@/hooks/useSendMessage';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';
import TalkFooter from '@mobile/TalkFooter';
import SendButton from '@mobile/TalkFooter/SendButton';
import Emoticon from '@mobile/TalkFooter/TalkFooterItems/Emoticon';

import DeleteMessageButton from '../DeleteMessageButton';

import * as S from './styled';

const Content = observer(() => {
  const {
    uiStore,
    getEditorStore,
    messageStore,
    configStore,
    getAttachmentStore,
  } = useStore();
  const { personaStore, userStore, roomStore } = useCoreStore();
  const docsStore = useDocsStore();
  const docsUploadFunction = docsStore.getDriveStore().requestUploadDocument;
  const { hash } = useLocation();
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const personaList = roomStore
    .getRoomMemberList(roomStore.currentRoomId as number)
    .map((roomMember) => {
      return personaStore.getPersona(roomMember.personaId);
    }) as PersonaModel[];
  const attachmentStore = getAttachmentStore(currentRoomId);
  const editorStore = getEditorStore(currentRoomId);
  const theme = useTheme();
  const quillRef = useRef(null);
  const myId = userStore.selectedPersona?.id || 1234; // 임시
  const nick = personaStore.getPersona(myId)?.nick || 'nick'; // 임시
  const location = useLocation();
  const navigate = useNavigate();
  const disabled = useObserver(() => {
    if (userStore.selectedPersona?.restriction)
      return userStore.selectedPersona?.restriction?.restrictedType & 4;
    return false;
  });

  const handleEnter = useCallback(async () => {
    if (disabled) return;
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const { isDm } = getRoomType(room);
    const msg = useMessageFormatter(
      editorStore,
      currentRoomId,
      nick,
      isDm ? nick : room.name,
    );
    const parentId = !editorStore.content
      ? messageStore.replyMessage?.msgId
      : undefined;
    const { send, clear } = useSendMessage(msg, editorStore);
    const { clearAttach, sendAttach } = useSendAttach({
      myId,
      nick,
      roomName: isDm ? nick : room.name,
      msg,
      parentId,
      docsUploadFunction,
    });
    if (location.pathname.includes('bottomItems')) {
      navigate(-1);
    }
    clear();
    clearAttach();
    const { toDelete } = await sendAttach();
    const result = await send(toDelete);
    if (result) {
      messageStore.scrollToBottom('auto');
    }
  }, [editorStore, disabled]);

  const { Color } = useTheme();

  if (hash === '#delete-mode') {
    return <DeleteMessageButton />;
  }

  return (
    <>
      {/* <S.ContentWrapper>
        <TalkBody />
      </S.ContentWrapper> */}
      <Observer>
        {/* mini 채팅에서는 attach, emoticon 기능만 제공 */}
        {() => (
          <TalkFooter
            uiStore={uiStore}
            attachmentStore={attachmentStore}
            TalkFooterMenu={
              // attachmentStore.attachments.length
              //   ? [<AttachMore key="attachmore" />]
              //   : [
              //       <Notice key="notice" />,
              //       [!isMyRoom && <Vote key="vote" />],
              //       <Attach key="attach" />,
              //       <Emoticon key="emoticon" />,
              //     ]
              [<Open key="attach" />]
            }
            MessageInput={
              <>
                {uiStore.openReplyInfo && (
                  <S.IconWrap>
                    <Icon.ReplyLine
                      width={24}
                      height={24}
                      color={configStore.InputMessageStyle.ReplyArrowColor}
                    />
                  </S.IconWrap>
                )}
                <TalkQuill
                  theme={theme}
                  editorStore={editorStore}
                  roomId={currentRoomId}
                  ref={quillRef}
                  handleEnter={handleEnter}
                  placeholder={
                    disabled
                      ? '채팅 제한의 유저는 메세지를 보낼 수 없습니다.'
                      : '메시지를 입력하세요.'
                  }
                />
              </>
            }
            MentionButton={<Mention editorStore={editorStore} />}
            EmoticonButton={<Emoticon />}
            SendButton={<SendButton />}
            style={{
              backgroundColor: Color.Background[0],
              color: Color.Gray[900],
            }}
          />
        )}
      </Observer>
    </>
  );
});

export default Content;
