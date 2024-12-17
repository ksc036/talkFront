import { makeAutoObservable } from 'mobx';

import { Link, LinkModel, LinkObjectModel, MessageModel } from '@/models';
import { LinkRepoImpl } from '@/repositories/LinkRepository';
import { timeStampFormat } from '@/utils';

import { RootStore } from './RootStore';

export class LinkStore {
  rootStore: RootStore;
  links: LinkObjectModel[] = [];
  downHasMore = false;
  repo = LinkRepoImpl;
  isSearchMode = false;
  isSearched = false;
  keyword = '';
  selectedLink: LinkModel | null = null;
  anchorMenu: HTMLElement | null = null;
  checkedLinks: { linkId: number; personaId: number }[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  getLinks = async ({
    targetId,
    msgId,
    downSize,
  }: {
    targetId?: number;
    msgId?: number;
    downSize?: number;
  }) => {
    const currentRoomId = this.rootStore.coreStore?.roomStore
      .currentRoomId as number;
    const { data } = this.rootStore.configStore.RoomEnter
      ? await this.repo.getLinks({
          targetId,
          msgId,
          downSize: downSize ?? 20,
          keyword: this.keyword,
          roomEnterTime: this.rootStore.coreStore?.roomStore.getRoomById(
            currentRoomId,
          )?.myInfo?.joinDate as string,
          roomId: currentRoomId,
        })
      : await this.repo.getLinks({
          targetId,
          msgId,
          downSize: downSize ?? 20,
          keyword: this.keyword,
          roomId: currentRoomId,
        });

    this.links = [...this.links, ...data.linkListWebResList];
    this.downHasMore = data.downHasMore;
  };

  search = async () => {
    if (!this.keyword) return;
    this.clear();
    this.isSearched = true;
    await this.getLinks({});
  };

  reset = () => {
    this.links = [];
    this.downHasMore = false;
    this.isSearchMode = false;
    this.isSearched = false;
    this.keyword = '';
  };

  clear = () => {
    this.links = [];
  };

  setIsSearchMode = (bool: boolean) => {
    this.isSearchMode = bool;
  };

  setIsSearched = (bool: boolean) => {
    this.isSearched = bool;
  };

  setKeyword = (keyword: string) => {
    this.keyword = keyword;
  };

  setSelectedLink = (link: LinkModel | null) => {
    this.selectedLink = link;
  };

  setCheckedLinks = (linkId: number, personaId: number) => {
    if (
      this.checkedLinks
        .map((checkedLink) => checkedLink.linkId)
        .includes(linkId)
    ) {
      this.checkedLinks = this.checkedLinks.filter(
        (checkedLink) => checkedLink.linkId !== linkId,
      );
    } else {
      this.checkedLinks = [...this.checkedLinks, { linkId, personaId }];
    }
  };

  clearCheckedLinks = () => {
    this.checkedLinks = [];
  };

  setAnchorMenu = (anchor: HTMLElement | null) => {
    this.anchorMenu = anchor;
  };

  handleLinkWebsocket = (msg: MessageModel) => {
    if (!this.isSearched || msg.msgBody.ogUrl?.includes(this.keyword)) {
      const newLink = new Link(msg);

      const newLinkDate = timeStampFormat(msg.createdAt ?? '', 'YYYY-MM-DD');
      const recentLinkDate = timeStampFormat(
        this.links?.[0]?.date ?? '',
        'YYYY-MM-DD',
      );

      const newLinks = [...this.links];

      if (newLinkDate === recentLinkDate) {
        newLinks?.[0].links?.unshift(newLink);
        this.links = newLinks;
      } else {
        const newLinkObject = {
          date: newLinkDate,
          links: [newLink],
        };
        this.links = [newLinkObject, ...this.links];
      }
    }
  };

  handleUpdateLink = (msg: MessageModel) => {
    this.links = this.links.map((linkObject: LinkObjectModel) => {
      return {
        ...linkObject,
        links: linkObject.links.map((link: LinkModel) => {
          if (link.msgId === msg.msgId) {
            return {
              ...link,
              ogTitle: msg.msgBody.ogTitle,
              ogDescription: msg.msgBody.ogDescription,
              ogImageUrl: msg.msgBody.ogImageUrl,
              linkId: msg.msgBody.linkId,
            };
          } else {
            return link;
          }
        }),
      };
    });
  };

  deleteLinks = async ({
    roomId,
    linkIds,
  }: {
    roomId: number;
    linkIds: number[];
  }) => {
    const res = await this.repo.deleteLinks({
      roomId,
      linkIds,
      appId: this.rootStore.talkStore.appId,
    });

    return res;
  };

  // 링크 삭제시 웹소켓
  handleDeleteLink = (jsonMessage: any) => {
    this.links = this.links.map((linkObject: LinkObjectModel) => {
      return {
        ...linkObject,
        links: linkObject.links.filter(
          (link: LinkModel) => !jsonMessage.linkIds.includes(link.linkId),
        ),
      };
    });
  };

  // 링크 메세지 삭제시 웹소켓
  handleDeleteLinkMsg = (jsonMessage: any) => {
    this.links = this.links.map((linkObject: LinkObjectModel) => {
      return {
        ...linkObject,
        links: linkObject.links.filter(
          (link: LinkModel) => !jsonMessage.msgIds.includes(link.msgId),
        ),
      };
    });
  };
}
