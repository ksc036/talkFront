import { RoomModel } from '@wapl/core';
import { makeAutoObservable } from 'mobx';

import { RegionType } from '@/constants/region';

import { RootStore } from './RootStore';

export type TabType = 'roomList' | 'openTalkHome' | 'regionOpenTalk';

export class OpenRoomStore {
  rootStore: RootStore;
  __curTabIndex = 0;
  __tabs: TabType[] = ['roomList', 'openTalkHome', 'regionOpenTalk'];
  __searchKeyword = '';
  __searchMode = false;
  __searchResult: RoomModel[] = [];
  __selectedCategory = '전체';
  __selectedRegion: RegionType[] = [];
  __activatedRegion: RegionType[] = [];
  __selectedOpenRoom: RoomModel | undefined = undefined;
  __roomCreated = false;
  __roomDeleted = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get curTab(): TabType {
    return this.__tabs[this.__curTabIndex];
  }
  get curTabIndex() {
    return this.__curTabIndex;
  }
  setCurTabIndex(index: number) {
    this.__curTabIndex = index;
  }

  get searchKeyword() {
    return this.__searchKeyword;
  }
  setSearchKeyword(keyword: string) {
    this.__searchKeyword = keyword;
  }

  get searchMode() {
    return this.__searchMode;
  }
  setSearchMode(mode: boolean) {
    this.__searchMode = mode;
  }

  get searchResult() {
    return this.__searchResult;
  }
  setSearchResult(result: RoomModel[]) {
    this.__searchResult = result;
  }

  get selectedCategory() {
    return this.__selectedCategory;
  }
  setSelectedCategory(selectedCategory: string) {
    this.__selectedCategory = selectedCategory;
  }

  get selectedRegion() {
    return this.__selectedRegion;
  }
  setSelectedRegion(selectedRegion: RegionType[]) {
    this.__selectedRegion = selectedRegion;
  }

  get activatedRegion() {
    return this.__activatedRegion;
  }
  setActivatedRegion(activatedRegion: RegionType[]) {
    this.__activatedRegion = activatedRegion;
  }

  get roomCreated() {
    return this.__roomCreated;
  }
  setRoomCreated(flag: boolean) {
    this.__roomCreated = flag;
  }

  get roomDeleted() {
    return this.__roomDeleted;
  }
  setRoomDeleted(flag: boolean) {
    this.__roomDeleted = flag;
  }

  get selectedOpenRoom() {
    return this.__selectedOpenRoom;
  }
  setSelectedOpenRoom(room: RoomModel) {
    this.__selectedOpenRoom = room;
  }

  clear(): void {
    this.setActivatedRegion([]);
    this.setSelectedRegion([]);
  }
}
