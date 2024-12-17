import { memo, useEffect, useState } from 'react';

import { useCoreStore, RoomMember, RoomModel } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import MentionListModal from '@/components/Common/MentionModal/MentionListModal';
import SearchMentionModal from '@/components/Common/MentionModal/SearchMentionModal';
import { useStore } from '@/stores';
import { sortByPersonaName, getRoomType } from '@/utils';

const MentionModal = observer(() => {
  const { getEditorStore, uiStore, configStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const editorStore = getEditorStore(roomStore.currentRoomId as number);
  const isSearchMentionMode =
    getRoomType(
      roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    ).isOpenRoom && configStore.MentionType === 'Search';
  const handleClose = () => {
    editorStore.focus();
    uiStore.setOpenMention(false);
    uiStore.setMentionKeyword('');
  };
  const [searched, setSearched] = useState(false);
  const [roomMemberList, setRoomMemberList] = useState<RoomMember[]>([]);
  const [savedIndex, setSavedIndex] = useState(0);

  useEffect(() => {
    if (!isSearchMentionMode || uiStore.mentionKeyword.length >= 2) {
      const temp = sortByPersonaName(
        roomStore.getRoomMemberList(roomStore.currentRoomId as number),
      ).sort((a, b) =>
        a.personaId === userStore.selectedPersona?.id
          ? -1
          : b.personaId === userStore.selectedPersona?.id
          ? 1
          : 0,
      );
      setRoomMemberList(temp);
      setSearched(true);
      setSavedIndex(editorStore.quill.selection.savedRange.index);
    }
  }, [uiStore.mentionKeyword]);

  return isSearchMentionMode && uiStore.mentionKeyword.length < 2 ? (
    <SearchMentionModal handleClose={handleClose} />
  ) : (
    <MentionListModal
      searched={searched}
      editorStore={editorStore}
      handleClose={handleClose}
      roomMemberList={roomMemberList}
      savedIndex={savedIndex}
      keyword={uiStore.mentionKeyword}
    />
  );
});

export default memo(MentionModal);
