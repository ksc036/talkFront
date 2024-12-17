import {
  useMemo,
  useRef,
  useCallback,
  useContext,
  lazy,
  Suspense,
} from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { PersonaModel, RoomModel, useCoreStore } from '@wapl/core';
import { useTheme } from '@wapl/ui';
import { Observer, useObserver } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import DefaultFooter from '@/components/Desktop/TalkFooter/DefaultFooter';
import { LargeFooterFallback } from '@/components/Desktop/TalkFooter/LargeFooter/FooterTemplate/Styled';
import useAttachInput from '@/hooks/useAttachInput';
import useDragAndDrop from '@/hooks/useDragAndDrop';
import useMessageFormatter from '@/hooks/useMessageFormatter';
import { useQuillMention } from '@/hooks/useQuillMention';
import useSendAttach from '@/hooks/useSendAttach';
import useSendMessage from '@/hooks/useSendMessage';
import { useStore } from '@/stores';
import { TopPropsContext } from '@/TopPropsProvider';
import { getRoomType } from '@/utils';
import { isFormattedMessage } from '@/utils/editor';

import TalkBody from '../TalkBody';

import * as S from './styled';

const Content = observer(() => {
  const {
    uiStore,
    getEditorStore,
    messageStore,
    getAttachmentStore,
    configStore,
  } = useStore();
  const { personaStore, userStore, roomStore } = useCoreStore();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();
  const docsUploadFunction = driveStore.requestUploadDocument;
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;

  const personaList = roomStore
    .getRoomMemberList(roomStore.currentRoomId as number)
    .map((roomMember) => {
      return personaStore.getPersona(roomMember.personaId);
    }) as PersonaModel[];

  const editorStore = getEditorStore(currentRoomId);
  const theme = useTheme();
  const attachmentStore = getAttachmentStore(currentRoomId);
  const quillRef = useRef(null);
  const myId = userStore.selectedPersona?.id || 1234; // 임시
  const nick = personaStore.getPersona(myId)?.nick || 'nick'; // 임시
  const { docsUploadCallback } = useContext(TopPropsContext);
  const { isMyRoom, isBotRoom } = getRoomType(
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
  );
  const disabled = useObserver(() => {
    if (userStore.selectedPersona?.restriction)
      return userStore.selectedPersona?.restriction?.restrictedType & 4;
    return isBotRoom;
  });
  const handleEnter = useCallback(async () => {
    if (disabled) return;
    if (!attachmentStore.readyToUpload) return;
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const { isDm } = getRoomType(room);
    const isFormatted = isFormattedMessage(editorStore?.quillRef);
    const msg = useMessageFormatter(
      editorStore,
      currentRoomId,
      nick,
      isDm ? nick : room.name,
      isFormatted,
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
      docsUploadCallback,
      docsUploadFunction,
      parentId,
    });
    clear();
    clearAttach();
    const { toDelete } = await sendAttach();
    const result = await send(toDelete);
    if (result) {
      messageStore.scrollToBottom('auto');
    }
  }, [editorStore, disabled]);

  const modules = useMemo(
    () => [
      {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }],
          ['link'],
        ],
      },
    ],
    [],
  );

  const { handleDragAttach, AttachFailModal } = useAttachInput(currentRoomId);
  const dragRef = useRef<HTMLInputElement>(null);
  const { isDragging } = useDragAndDrop(dragRef, handleDragAttach);
  const LargeFooter = lazy(
    () => import('@/components/Desktop/TalkFooter/LargeFooter'),
  );

  return (
    <S.DNDBox
      ref={configStore.FooterMenuItems.File && !isBotRoom ? dragRef : null}
      isDragging={isDragging}
    >
      <S.ContentWrapper>
        <TalkBody />
      </S.ContentWrapper>
      <Observer>
        {/* mini 채팅에서는 attach, emoticon 기능만 제공 */}
        {() =>
          configStore.FooterType === 'Default' ? (
            <DefaultFooter
              uiStore={uiStore}
              attachmentStore={attachmentStore}
              configStore={configStore}
              editorStore={editorStore}
              isMyRoom={isMyRoom}
              currentRoomId={currentRoomId}
              theme={theme}
              quillRef={quillRef}
              handleEnter={handleEnter}
              modules={modules}
            />
          ) : (
            <Suspense fallback={<LargeFooterFallback />}>
              <LargeFooter
                uiStore={uiStore}
                attachmentStore={attachmentStore}
                configStore={configStore}
                editorStore={editorStore}
                isMyRoom={isMyRoom}
                currentRoomId={currentRoomId}
                theme={theme}
                quillRef={quillRef}
                handleEnter={handleEnter}
                modules={modules}
              />
            </Suspense>
          )
        }
      </Observer>
      <AttachFailModal />
    </S.DNDBox>
  );
});

export default Content;
