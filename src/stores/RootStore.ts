import { CoreStore } from '@wapl/core';
import { idbKeyController } from '@wapl/pl-idb';

import { AttachmentStore } from '@/stores/AttachmentStore';
import { EditorStore } from '@/stores/EditorStore';
import { EmoticonStore } from '@/stores/EmoticonStore';
import { FileStore } from '@/stores/FileStore';
import { LinkStore } from '@/stores/LinkStore';

import { ConfigStore } from './configStore';
import { MessageStore } from './MessageStore';
import { NoticeStore } from './NoticeStore';
import { OpenRoomStore } from './OpenRoomStore';
import { ReactionStore } from './ReactionStore';
import { RefStore } from './RefStore';
import { ReserveStore } from './ReserveStore';
import { SubAppStore } from './SubAppStore';
import { TalkStore } from './TalkStore';
import { UIStore } from './UIStore';
import { VoteStore } from './VoteStore';

export class RootStore {
  uiStore: UIStore;
  refStore: RefStore;
  messageStore: MessageStore;
  openRoomStore: OpenRoomStore;
  noticeStore: NoticeStore;
  voteStore: VoteStore;
  reserveStore: ReserveStore;
  emoticonStore: EmoticonStore;
  reactionStore: ReactionStore;
  talkStore: TalkStore;
  fileStore: FileStore;
  configStore: ConfigStore;
  editorStores: Map<number, EditorStore>;
  attachmentStores: Map<number, AttachmentStore>;
  linkStore: LinkStore;
  subAppStore: SubAppStore;
  coreStore: CoreStore | null;

  constructor() {
    // idbKeyController.initialize(
    //   coreStore.userStore.selectedPersona?.id as number,
    //   coreStore.userStore.selectedPersona?.regiDate as string,
    // );
    this.uiStore = new UIStore();
    this.refStore = new RefStore();
    this.messageStore = new MessageStore(this);
    this.openRoomStore = new OpenRoomStore(this);
    this.noticeStore = new NoticeStore(this);
    this.voteStore = new VoteStore(this);
    this.reserveStore = new ReserveStore(this);
    this.emoticonStore = new EmoticonStore(this);
    this.reactionStore = new ReactionStore(this);
    this.editorStores = new Map();
    this.attachmentStores = new Map();
    this.talkStore = new TalkStore();
    this.fileStore = new FileStore(this);
    this.configStore = new ConfigStore();
    this.getEditorStore = this.getEditorStore.bind(this);
    this.getAttachmentStore = this.getAttachmentStore.bind(this);
    this.linkStore = new LinkStore(this);
    this.subAppStore = new SubAppStore();

    this.messageStore.initialize();
    this.reactionStore.initialize();
    this.noticeStore.initialize();
    this.voteStore.initialize();
    this.fileStore.initialize();
    this.coreStore = null;
  }

  addCoreStore(coreStore: any) {
    if (!this.coreStore) this.coreStore = coreStore;
    else return;
  }

  getEditorStore(roomId: number) {
    let editorStore = this.editorStores.get(roomId);
    if (!editorStore) {
      editorStore = new EditorStore();
      this.editorStores.set(roomId, editorStore);
    }
    return editorStore;
  }

  getAttachmentStore(roomId: number) {
    let attachmentStore = this.attachmentStores.get(roomId);
    if (!attachmentStore) {
      attachmentStore = new AttachmentStore(this);
      this.attachmentStores.set(roomId, attachmentStore);
    }
    return attachmentStore;
  }
}

export const rootStore = new RootStore();

export function useStore() {
  return rootStore;
}
