import { Suspense, lazy } from 'react';

import { PersonaModel, RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer, useObserver } from 'mobx-react';

import { TalkFooterItemFallback } from '@/components/Common/TalkFooterItem/Styled';
import { DefaultFooterPorps } from '@/components/Desktop/TalkFooter/DefaultFooter';
import TalkFooter from '@/components/Desktop/TalkFooter/LargeFooter/FooterTemplate';
import SendButton from '@/components/Desktop/TalkFooter/LargeFooter/SendButton';
import * as S from '@/components/Desktop/TalkFooter/LargeFooter/Styled';
import Count from '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItems/Count';
import Emoticon from '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItems/Emoticon';
import Vote from '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItems/Vote';
import TalkQuill from '@/components/Desktop/TalkFooter/LargeFooter/TalkQuill';
import 'quill-mention';
import { getRoomRestraints } from '@/utils';

const LargeFooter = observer((props: DefaultFooterPorps) => {
  const {
    uiStore,
    editorStore,
    configStore,
    isMyRoom,
    currentRoomId,
    theme,
    quillRef,
    handleEnter,
    modules,
  } = props;

  const { Color } = useTheme();
  const { userStore, roomStore } = useCoreStore();

  const Mention = lazy(
    () =>
      import(
        '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItems/Mention'
      ),
  );
  const Attach = lazy(
    () =>
      import(
        '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItems/Attach'
      ),
  );
  const Notice = lazy(
    () =>
      import(
        '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItems/Notice'
      ),
  );

  const { isDisabled, isRestricted } = useObserver(() => {
    return getRoomRestraints(
      userStore.selectedPersona as PersonaModel,
      roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    );
  });

  return (
    <TalkFooter
      editorStore={editorStore}
      uiStore={uiStore}
      TalkFooterMenu={[
        configStore.FooterMenuItems.Notice && (
          <Suspense
            key="notice"
            fallback={
              <TalkFooterItemFallback>
                <Icon.NoticeLine
                  width={24}
                  height={24}
                  color={Color.Gray[900]}
                />
              </TalkFooterItemFallback>
            }
          >
            <Notice />
          </Suspense>
        ),
        [
          !isMyRoom && configStore.FooterMenuItems.Vote && (
            <Suspense
              key="vote"
              fallback={
                <TalkFooterItemFallback>
                  <Icon.VoteLine
                    width={24}
                    height={24}
                    color={Color.Gray[900]}
                  />
                </TalkFooterItemFallback>
              }
            >
              <Vote />
            </Suspense>
          ),
        ],
        configStore.FooterMenuItems.File && (
          <Suspense
            key="attach"
            fallback={
              <TalkFooterItemFallback>
                <Icon.AttachLine
                  width={24}
                  height={24}
                  color={Color.Gray[900]}
                />
              </TalkFooterItemFallback>
            }
          >
            <Attach />
          </Suspense>
        ),
        <Suspense
          key="mention"
          fallback={
            <TalkFooterItemFallback>
              <Icon.MentionLine
                width={24}
                height={24}
                color={configStore.IconColor}
              />
            </TalkFooterItemFallback>
          }
        >
          <Mention editorStore={editorStore} />
        </Suspense>,
        configStore.FooterMenuItems.Emoticon && (
          <Suspense
            key="emoticon"
            fallback={
              <TalkFooterItemFallback>
                <Icon.Emoji1Line
                  width={24}
                  height={24}
                  color={configStore.IconColor}
                />
              </TalkFooterItemFallback>
            }
          >
            <Emoticon />
          </Suspense>
        ),
      ]}
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
            modules={modules}
            placeholder={
              !isDisabled
                ? '메시지를 입력하세요.'
                : isRestricted
                ? '채팅 제한의 유저는 메시지를 보낼 수 없습니다.'
                : '메시지를 보낼 수 없습니다.'
            }
            mentionColor={configStore.OtherMessageStyle.MentionColor}
            readOnly={isDisabled}
          />
        </>
      }
      count={<Count editorStore={editorStore} />}
      SendButton={<SendButton />}
    />
  );
});
export default LargeFooter;
