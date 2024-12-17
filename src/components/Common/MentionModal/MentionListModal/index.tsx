import { memo, useEffect, useState } from 'react';

import { RoomMember } from '@wapl/core';
import { Mui } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import MentionListItems from '@/components/Common/MentionModal/MentionListModal/MentionListItems';
import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';
import { isMobile } from '@/utils';

interface MentionListModalProps {
  searched: boolean;
  handleClose: () => void;
  editorStore: EditorStore;
  roomMemberList: RoomMember[];
  savedIndex: number;
  keyword: string;
}

const MentionListModal = observer((props: MentionListModalProps) => {
  const { handleClose, editorStore, roomMemberList, savedIndex, keyword } =
    props;
  const { configStore, uiStore } = useStore();
  const [mentionMemberList, setMentionMemberList] = useState<RoomMember[]>([]);

  const desktopAnchorEl =
    configStore.FooterType === 'Large'
      ? document.getElementById('talk-body')
      : document.getElementById('talk-quill');

  const desktopSx =
    configStore.FooterType === 'Large' ? { top: -8, left: 8 } : { top: -48 };

  useEffect(() => {
    if (uiStore.openMention) {
      if (uiStore.mentionKeyword.length > 0) {
        setMentionMemberList(
          roomMemberList?.filter(({ personaNick }) =>
            personaNick
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(keyword.toLowerCase()),
          ),
        );
      } else {
        setMentionMemberList(roomMemberList);
      }
    }
  }, [uiStore.mentionKeyword, roomMemberList]);

  useEffect(() => {
    uiStore.setMentionLength(mentionMemberList.length);
    if (mentionMemberList.length === 0) uiStore.setMentionSelected(-1);
    else uiStore.setMentionSelected(0);
  }, [mentionMemberList]);

  if (isMobile()) {
    return mentionMemberList.length > 0 ? (
      <MentionListItems
        mentionMemberList={mentionMemberList}
        editorStore={editorStore}
        savedIndex={savedIndex}
        keyword={keyword}
      />
    ) : (
      <></>
    );
  }

  return mentionMemberList.length > 0 ? (
    <Mui.Menu
      id="basic-menu"
      anchorEl={desktopAnchorEl}
      open={true}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        style: {
          borderRadius: '10px',
          padding: '12px 0',
          boxShadow: '0px 0px 8px 0px #00000033',
        },
        elevation: isMobile() ? 0 : 8,
      }}
      MenuListProps={{ disablePadding: true }}
      sx={desktopSx}
      disableAutoFocus
    >
      <MentionListItems
        mentionMemberList={mentionMemberList}
        editorStore={editorStore}
        savedIndex={savedIndex}
        keyword={keyword}
      />
    </Mui.Menu>
  ) : (
    <></>
  );
});

export default memo(MentionListModal);
