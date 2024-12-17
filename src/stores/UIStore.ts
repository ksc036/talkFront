import { PersonaModel } from '@wapl/core';
import { makeAutoObservable } from 'mobx';

import * as T from '@types';

type DialogType =
  | 'notice'
  | 'confirmDeletedNotice'
  | 'deliver'
  | 'shareLink'
  | 'invite'
  | 'vote'
  | 'deletedVote'
  | 'cancelVote'
  | 'confirmVoteDelete'
  | 'confirmFixedVote'
  | 'confirmDeletedVote'
  | 'confirmUpdatedVote'
  | 'confirmClosedVote'
  | 'reaction'
  | 'openRoomCreate'
  | 'openRoomProfile'
  | 'openMeeting'
  | 'confirmLinkDelete'
  | 'mail'
  | 'createMail'
  | 'invalidFile'
  | 'zipDownloading'
  | 'reserve';
type ContextMenuType = 'message' | 'deliver';
type LNBType = 'search' | 'home' | 'room';
type MailModalType = 'read' | 'writeNew' | 'reply';
type ReserveModalType =
  | 'list'
  | 'create'
  | 'edit'
  | 'readFromList'
  | 'readFromCreate'
  | 'readFromEdit';
type DesktopProfilePosition =
  | 'myMention'
  | 'otherMention'
  | 'roomMenuList'
  | 'headerProfile'
  | 'myUnreadList'
  | 'otherUnreadList'
  | 'messageProfile';

export class UIStore {
  desktopProfileAnchorEl: HTMLElement | null = null;

  desktopProfilePosition: DesktopProfilePosition = 'myMention';

  roomMenuAnchorEl: HTMLElement | null = null;

  roomLinkShareAnchorEl: HTMLElement | null = null;

  selectedLNBTab: LNBType = 'home';

  openMessageContextMenu = false;

  openDeliverContextMenu = false;

  openNotice = false;

  confirmDeletedNotice = false;

  openReaction = false;

  openEmoticonModal = false;

  openRoomCreate = false;

  openRoomProfile = false;

  noticeDialogMode: T.NoticeModeType = 'list';

  openReplyInfo = false;

  openToolbar = false;

  openStickerPreview = false;

  openDeliver = false;

  openShareLink = false;

  openInvite = false;

  openVote = false;

  openMail = false;

  mailDialogMode: MailModalType = 'writeNew';

  mailViewId = -1;

  enterRoomFail = false;

  enterMessageFail = false;

  roomKickedout = false;

  deletedVote = false;

  cancelVote = false;

  confirmVoteDelete = false;

  confirmDeletedVote = false;

  confirmUpdatedVote = false;

  confirmClosedVote = false;

  confirmFixedVote = false;

  voteDialogMode: T.VoteModeType = 'allVote';

  toastOpen = false;

  toastString = '';

  // for mobile
  opentalkBottom = false;

  alarmNavigate = false;

  selectedPersonaId = -1;

  selectedPersona: PersonaModel = new PersonaModel(null);

  openMention = false;

  mentionKeyword = '';

  mentionSelected = 0;

  mentionLength = 0;

  mentionId = -1;

  mentionNick = '';

  openLinkDrawer = false;

  openMediaPreview = false;

  openMediaShare = false;

  mediaPreviewLoading = false;

  openMeeting = false;

  confirmLinkDelete = false;

  openGetMessageFail = false;

  openRoomSearchDialog = false;

  openMiniChatDisabledDialog = false;

  showMessageMenus = true;

  invalidFile = false;

  uploadFailedFileNames: string[] = [];

  openZipDownloading = false;

  zipDownloadSize = '';

  showSearchBar = false;

  showFullScreenViewer = true;

  openReserve = false;

  reserveDialogType: ReserveModalType = 'list';

  constructor() {
    makeAutoObservable(this);
  }

  openToast(str: string) {
    this.toastString = str;
    this.toastOpen = true;
  }

  closeToast() {
    this.toastOpen = false;
  }

  openDialog(dialogType: DialogType) {
    switch (dialogType) {
      case 'notice':
        this.openNotice = true;
        break;
      case 'confirmDeletedNotice':
        this.confirmDeletedNotice = true;
        break;
      case 'deliver':
        this.openDeliver = true;
        break;
      case 'shareLink':
        this.openShareLink = true;
        break;
      case 'invite':
        this.openInvite = true;
        break;
      case 'vote':
        this.openVote = true;
        break;
      case 'mail':
        this.openMail = true;
        break;
      case 'deletedVote':
        this.deletedVote = true;
        break;
      case 'cancelVote':
        this.cancelVote = true;
        break;
      case 'confirmVoteDelete':
        this.confirmVoteDelete = true;
        break;
      case 'confirmDeletedVote':
        this.confirmDeletedVote = true;
        break;
      case 'confirmUpdatedVote':
        this.confirmUpdatedVote = true;
        break;
      case 'confirmClosedVote':
        this.confirmClosedVote = true;
        break;
      case 'confirmFixedVote':
        this.confirmVoteDelete = true;
        break;
      case 'reaction':
        this.openReaction = true;
        break;
      case 'openRoomCreate':
        this.openRoomCreate = true;
        break;
      case 'openRoomProfile':
        this.openRoomProfile = true;
        break;
      case 'openMeeting':
        this.openMeeting = true;
        break;
      case 'confirmLinkDelete':
        this.confirmLinkDelete = true;
        break;
      case 'invalidFile':
        this.invalidFile = true;
        break;
      case 'zipDownloading':
        this.openZipDownloading = true;
        break;
      case 'reserve':
        this.openReserve = true;
        break;
    }
  }

  closeDialog(dialogType: DialogType) {
    switch (dialogType) {
      case 'notice':
        this.openNotice = false;
        break;
      case 'confirmDeletedNotice':
        this.confirmDeletedNotice = false;
        break;
      case 'deliver':
        this.openDeliver = false;
        break;
      case 'shareLink':
        this.openShareLink = false;
        break;
      case 'invite':
        this.openInvite = false;
        break;
      case 'vote':
        this.openVote = false;
        break;
      case 'mail':
        this.openMail = false;
        break;
      case 'deletedVote':
        this.deletedVote = false;
        break;
      case 'cancelVote':
        this.cancelVote = false;
        break;
      case 'confirmVoteDelete':
        this.confirmVoteDelete = false;
        break;
      case 'confirmDeletedVote':
        this.confirmDeletedVote = false;
        break;
      case 'confirmUpdatedVote':
        this.confirmUpdatedVote = false;
        break;
      case 'confirmClosedVote':
        this.confirmClosedVote = false;
        break;
      case 'confirmFixedVote':
        this.confirmVoteDelete = false;
        break;
      case 'reaction':
        this.openReaction = false;
        break;
      case 'openRoomCreate':
        this.openRoomCreate = false;
        break;
      case 'openRoomProfile':
        this.openRoomProfile = false;
        break;
      case 'openMeeting':
        this.openMeeting = false;
        break;
      case 'confirmLinkDelete':
        this.confirmLinkDelete = false;
        break;
      case 'invalidFile':
        this.invalidFile = false;
        break;
      case 'zipDownloading':
        this.openZipDownloading = false;
        break;
      case 'reserve':
        this.openReserve = false;
        break;
    }
  }

  openContextMenu(contextMenuType: ContextMenuType) {
    switch (contextMenuType) {
      case 'message':
        this.openMessageContextMenu = true;
        break;
      case 'deliver':
        this.openDeliverContextMenu = true;
        break;
    }
  }

  closeContextMenu(contextMenuType: ContextMenuType) {
    switch (contextMenuType) {
      case 'message':
        this.openMessageContextMenu = false;
        break;
      case 'deliver':
        this.openDeliverContextMenu = false;
        break;
    }
  }

  setSelectedLNBTab = (tab: LNBType) => {
    this.selectedLNBTab = tab;
  };

  setDesktopProfileAnchorEl = (node: HTMLElement | null) => {
    this.desktopProfileAnchorEl = node;
  };

  setDesktopProfilePosition = (position: DesktopProfilePosition) => {
    this.desktopProfilePosition = position;
  };

  setRoomMenuAnchorEl = (node: HTMLElement | null) => {
    this.roomMenuAnchorEl = node;
  };

  setRoomLinkShareAnchorEl = (node: HTMLElement | null) => {
    this.roomLinkShareAnchorEl = node;
  };

  setNoticeDialogMode = (mode: T.NoticeModeType) => {
    this.noticeDialogMode = mode;
  };

  setMailDialogMode = (mode: MailModalType) => {
    this.mailDialogMode = mode;
  };

  setMailViewId = (id: number) => {
    this.mailViewId = id;
  };

  setEmoticonModalVisible = (visible: boolean) => {
    this.openEmoticonModal = visible;
  };

  setVoteDialogMode = (mode: T.VoteModeType) => {
    this.voteDialogMode = mode;
  };

  setReserveDialogMode = (mode: ReserveModalType) => {
    this.reserveDialogType = mode;
  };

  setReplyVisible = (visible: boolean) => {
    this.openReplyInfo = visible;
  };

  setToolbarVisible = (visible: boolean) => {
    this.openToolbar = visible;
  };

  setStickerPreview = (visible: boolean) => {
    this.openStickerPreview = visible;
  };

  setTalkBottomVisible = (visible: boolean) => {
    this.opentalkBottom = visible;
  };

  setEnterRoomFail = (bool: boolean) => {
    this.enterRoomFail = bool;
  };

  setEnterMessageFail = (bool: boolean) => {
    this.enterMessageFail = bool;
  };

  setRoomKickedout = (bool: boolean) => {
    this.roomKickedout = bool;
  };

  setAlarmNavigate = (bool: boolean) => {
    this.alarmNavigate = bool;
  };

  setSelectedPersonaId = (personaId: number) => {
    this.selectedPersonaId = personaId;
  };

  setSelectedPersona = (persona: PersonaModel) => {
    this.selectedPersona = persona;
  };

  setOpenMention = (bool: boolean) => {
    this.openMention = bool;
  };

  setMentionKeyword = (keyword: string) => {
    this.mentionKeyword = keyword;
  };

  setMentionSelected = (selected: number) => {
    if (this.mentionLength > 0) {
      if (selected < 0) {
        this.mentionSelected =
          (this.mentionLength + selected) % this.mentionLength;
      } else {
        this.mentionSelected = selected % this.mentionLength;
      }
    } else {
      this.mentionSelected = selected;
    }
  };

  setMentionLength = (length: number) => {
    this.mentionLength = length;
  };

  setMentionTarget = (id: number, nick: string) => {
    this.mentionId = id;
    this.mentionNick = nick;
  };

  setOpenLinkDrawer = (bool: boolean) => {
    this.openLinkDrawer = bool;
  };

  setOpenMediaPreview = (bool: boolean) => {
    this.openMediaPreview = bool;
  };

  setOpenMediaShare = (bool: boolean) => {
    this.openMediaShare = bool;
  };

  setMediaPreviewLoading = (bool: boolean) => {
    this.mediaPreviewLoading = bool;
  };

  closeDrawers = () => {
    this.openLinkDrawer = false;
  };

  setOpenGetMessageFail = (bool: boolean) => {
    this.openGetMessageFail = bool;
  };

  setOpenRoomSearchDialog = (bool: boolean) => {
    this.openRoomSearchDialog = bool;
  };

  setOpenMiniChatDisabledDialog = (bool: boolean) => {
    this.openMiniChatDisabledDialog = bool;
  };

  setShowMessageMenus = (bool: boolean) => {
    this.showMessageMenus = bool;
  };

  setUploadFailedFileNames = (fileNames: string[]) => {
    this.uploadFailedFileNames = fileNames;
  };

  setZipDownloadSize = (downloadSize: string) => {
    this.zipDownloadSize = downloadSize;
  };

  setShowSearchBar = (bool: boolean) => {
    this.showSearchBar = bool;
  };

  setShowFullScreenViewer = (bool: boolean) => {
    this.showFullScreenViewer = bool;
  };
}
