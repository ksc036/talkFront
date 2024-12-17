import { Theme } from '@wapl/ui';

import * as config from '@/config/config';
import * as T from '@types';

import {
  DOCS_EXTENSIONS,
  EXECUTABLE_EXTENSIONS,
  IMAGE_EXTENSIONS,
  MEDIA_EXTENSIONS,
  VOICE_EXTENSIONS,
  ZIP_EXTENSIONS,
} from '../constants/file';

export interface MessageStyle {
  BackgroundColor: string;
  TextColor: string;
  LinkColor: string;
  MentionColor: string;
  OgLinkColor: string;
  DeletedMessageColor: string;
  ReplyArrowColor: string;
  ReplyNameColor: string;
  ReplyToColor: string;
  ReplyMessageColor: string;
}

export interface HighlightedMessageStyle {
  HighlightedFocusedMessageColor: string;
  HighlightedOtherMessageColor: string;
  HighlightedTextColor: string;
}

export interface SearchBarStyle {
  BackgroundColor: string;
  BorderColor: string;
  Collapse: boolean;
  Width: number | null;
}

export interface InputMessageStyle {
  ReplyNameColor: string;
  ReplyToColor: string;
  ReplyArrowColor: string;
  BackGroundColor: string;
}

export interface MessageMenuStyle {
  BackgroundColor: string;
  IconColor: string;
}

export interface AutoMessageStyle {
  AutoMessageBackgroundColor: string;
  AutoMessageTextColor: string;
}

export class ConfigStore {
  config;
  theme!: Theme;

  constructor() {
    switch (process.env.REACT_APP_PLATFORM) {
      case 'sen':
        this.config = config.config_sen;
        break;
      case 'foodist':
        this.config = config.config_foodist;
        break;
      case 'ekr':
        this.config = config.config_ekr;
        break;
      case 'clas_admin':
        this.config = config.config_clas_admin;
        break;
      case 'superapp':
        this.config = config.config_superapp;
        break;
      default:
        this.config = config.config_superapp;
    }
  }

  get type() {
    return this.config.Type;
  }

  get homeType(): {
    homeShape: string;
    homeLogo: string;
    homeBackgroundColor: string;
  } {
    return {
      homeShape: this.config.HomeType.homeShape,
      homeLogo: this.config.HomeType.homeLogo,
      homeBackgroundColor: this.config.HomeType.homeBackgroundColor,
    };
  }

  get FooterType() {
    return this.config.FooterType;
  }

  get appBarType(): string {
    return this.config.AppBarType;
  }

  get MentionType() {
    return this.config.MentionType;
  }

  setMentionType(mentionType: T.MentionType) {
    this.config.MentionType = mentionType;
  }

  get MainColor(): string {
    return this.config.MainColor
      ? this.config.MainColor
      : this.theme.Color.Gray[200];
  }

  setMainColor(mainColor: string) {
    this.config.MainColor = mainColor;
  }

  get HeaderColor(): string {
    return this.config.HeaderStyle.BackgroundColor
      ? this.config.HeaderStyle.BackgroundColor
      : this.theme.Color.Black[6];
  }

  setHeaderColor(headerColor: string) {
    this.config.HeaderStyle.BackgroundColor = headerColor;
  }

  get HeaderMemberCountColor(): string {
    return this.config.HeaderStyle.MemberCountColor !== ''
      ? this.config.HeaderStyle.MemberCountColor
      : '#FAFCFF';
  }

  get BodyColor(): string {
    return this.config.BodyColor
      ? this.config.BodyColor
      : this.theme.Color.Gray[200];
  }

  setBodyColor(BodyColor: string) {
    this.config.BodyColor = BodyColor;
  }

  get IconColor(): string {
    return this.config.IconColor ?? this.theme.Color.Gray[900];
  }

  get CheckColor(): string {
    return this.config.CheckColor ?? this.theme.Color.Gray[900];
  }

  get PaginationColor(): string {
    return this.config.PaginationColor ?? this.theme.Color.Blue[400];
  }

  get FloatingButtonBackgroundColor(): string {
    return this.config.FloatingButtonBackgroundColor;
  }

  get FloatingButtonColor(): string {
    return this.config.FloatingButtonColor;
  }

  get ButtonPrimaryColor(): string {
    return this.config.ButtonPrimaryColor;
  }

  setFloatingButtonBackgroundColor(color: string) {
    this.config.FloatingButtonBackgroundColor = color;
  }

  setFloatingButtonColor(color: string) {
    this.config.FloatingButtonColor = color;
  }

  setButtonPrimaryColor(color: string) {
    this.config.ButtonPrimaryColor = color;
  }

  get AutoMessageBackgroundColor(): string {
    return this.config.AutoMessageBackgroundColor
      ? this.config.AutoMessageBackgroundColor
      : this.theme.Color.Gray[400];
  }

  get AutoMessageTextColor(): string {
    return this.config.AutoMessageTextColor
      ? this.config.AutoMessageTextColor
      : this.theme.Color.White[100];
  }

  get ToastBackgroundColor(): string {
    return this.config.ToastBackgroundColor
      ? this.config.ToastBackgroundColor
      : this.theme.Color.Black[70];
  }

  get FirstRankColor(): string {
    return this.config.FirstRankColor ?? '#FF4A3F';
  }

  get MessageMenu(): string[] {
    return this.config.MessageMenu;
  }

  get MessageMenuStyle(): {
    BackgroundColor: string;
    IconColor: string;
  } {
    return {
      BackgroundColor:
        this.config.MessageMenuStyle.BackgroundColor !== ''
          ? this.config.MessageMenuStyle.BackgroundColor
          : this.theme.Color.Gray[50],
      IconColor:
        this.config.MessageMenuStyle.IconColor !== ''
          ? this.config.MessageMenuStyle.IconColor
          : this.theme.Color.Gray[600],
    };
  }

  setMessageMenu(messagemenu: T.MessageMenu[]) {
    this.config.MessageMenu = messagemenu;
  }

  get messageDeliverText(): string {
    return this.config.MessageDeliverText;
  }

  get HighlightedFocusedMessageColor(): string {
    return this.config.HighlightedFocusedMessageColor !== ''
      ? this.config.HighlightedFocusedMessageColor
      : this.theme.Color.Blue[500];
  }

  get HighlightedOtherMessageColor(): string {
    return this.config.HighlightedOtherMessageColor !== ''
      ? this.config.HighlightedOtherMessageColor
      : this.theme.Color.Blue[100];
  }

  get HighlightedTextColor(): string {
    return this.config.HighlightedTextColor !== ''
      ? this.config.HighlightedTextColor
      : this.theme.Color.Gray[900];
  }

  get MessageTitleColor(): string {
    return this.config.MessageTitleColor !== ''
      ? this.config.MessageTitleColor
      : this.theme.Color.Gray[500];
  }

  get MefillColor(): string {
    return this.config.MefillColor !== ''
      ? this.config.MefillColor
      : this.theme.Color.Black[100];
  }

  get MyMessageStyle(): MessageStyle {
    return {
      BackgroundColor:
        this.config.MyMessageStyle.BackgroundColor !== ''
          ? this.config.MyMessageStyle.BackgroundColor
          : this.theme.Color.Black[100],
      TextColor:
        this.config.MyMessageStyle.TextColor !== ''
          ? this.config.MyMessageStyle.TextColor
          : this.theme.Color.White[100],
      LinkColor:
        this.config.MyMessageStyle.LinkColor !== ''
          ? this.config.MyMessageStyle.LinkColor
          : this.theme.Color.Blue[500],
      MentionColor:
        this.config.MyMessageStyle.MentionColor !== ''
          ? this.config.MyMessageStyle.MentionColor
          : this.theme.Color.Blue[500],
      OgLinkColor:
        this.config.MyMessageStyle.OgLinkColor !== ''
          ? this.config.MyMessageStyle.OgLinkColor
          : this.theme.Color.Blue[500],
      DeletedMessageColor:
        this.config.MyMessageStyle.DeletedMessageColor !== ''
          ? this.config.MyMessageStyle.DeletedMessageColor
          : this.theme.Color.Gray[500],
      ReplyArrowColor:
        this.config.MyMessageStyle.ReplyArrowColor !== ''
          ? this.config.MyMessageStyle.ReplyArrowColor
          : '#5C80FF',
      ReplyNameColor:
        this.config.MyMessageStyle.ReplyNameColor !== ''
          ? this.config.MyMessageStyle.ReplyNameColor
          : this.theme.Color.Gray[900],
      ReplyToColor:
        this.config.MyMessageStyle.ReplyToColor !== ''
          ? this.config.MyMessageStyle.ReplyToColor
          : this.theme.Color.Gray[700],
      ReplyMessageColor:
        this.config.MyMessageStyle.ReplyMessageColor !== ''
          ? this.config.MyMessageStyle.ReplyMessageColor
          : this.theme.Color.Gray[600],
    };
  }

  get OtherMessageStyle(): MessageStyle {
    return {
      BackgroundColor:
        this.config.OtherMessageStyle.BackgroundColor !== ''
          ? this.config.OtherMessageStyle.BackgroundColor
          : this.theme.Color.White[100],
      TextColor:
        this.config.OtherMessageStyle.TextColor !== ''
          ? this.config.OtherMessageStyle.TextColor
          : this.theme.Color.Gray[900],
      LinkColor:
        this.config.OtherMessageStyle.LinkColor !== ''
          ? this.config.OtherMessageStyle.LinkColor
          : this.theme.Color.Blue[500],
      MentionColor:
        this.config.OtherMessageStyle.MentionColor !== ''
          ? this.config.OtherMessageStyle.MentionColor
          : this.theme.Color.Blue[500],
      OgLinkColor:
        this.config.OtherMessageStyle.OgLinkColor !== ''
          ? this.config.OtherMessageStyle.OgLinkColor
          : this.theme.Color.Blue[500],
      DeletedMessageColor:
        this.config.OtherMessageStyle.DeletedMessageColor !== ''
          ? this.config.OtherMessageStyle.DeletedMessageColor
          : this.theme.Color.Gray[500],
      ReplyArrowColor:
        this.config.OtherMessageStyle.ReplyArrowColor !== ''
          ? this.config.OtherMessageStyle.ReplyArrowColor
          : '#5C80FF',
      ReplyNameColor:
        this.config.OtherMessageStyle.ReplyNameColor !== ''
          ? this.config.OtherMessageStyle.ReplyNameColor
          : this.theme.Color.Gray[900],
      ReplyToColor:
        this.config.OtherMessageStyle.ReplyToColor !== ''
          ? this.config.OtherMessageStyle.ReplyToColor
          : this.theme.Color.Gray[700],
      ReplyMessageColor:
        this.config.OtherMessageStyle.ReplyMessageColor !== ''
          ? this.config.OtherMessageStyle.ReplyMessageColor
          : this.theme.Color.Gray[600],
    };
  }

  setOtherMessageStyle(style: Partial<MessageStyle>) {
    this.config.OtherMessageStyle = {
      ...this.config.OtherMessageStyle,
      ...style,
    };
  }

  setMyMessageStyle(style: Partial<MessageStyle>) {
    this.config.MyMessageStyle = {
      ...this.config.MyMessageStyle,
      ...style,
    };
  }

  get InputMessageStyle(): InputMessageStyle {
    return {
      ReplyNameColor:
        this.config.InputMessageStyle.ReplyNameColor !== ''
          ? this.config.InputMessageStyle.ReplyNameColor
          : this.theme.Color.Blue[500],
      ReplyToColor:
        this.config.InputMessageStyle.ReplyToColor !== ''
          ? this.config.InputMessageStyle.ReplyToColor
          : this.theme.Color.Gray[600],
      ReplyArrowColor:
        this.config.InputMessageStyle.ReplyArrowColor !== ''
          ? this.config.InputMessageStyle.ReplyArrowColor
          : this.theme.Color.Blue[500],
      BackGroundColor:
        this.config.InputMessageStyle.BackGroundColor !== ''
          ? this.config.InputMessageStyle.BackGroundColor
          : this.theme.Color.Gray[100],
    };
  }

  get SearchBarStyle(): SearchBarStyle {
    return {
      BackgroundColor:
        this.config.SearchBarStyle.BackgroundColor !== ''
          ? this.config.SearchBarStyle.BackgroundColor
          : this.theme.Color.Gray[100],
      BorderColor:
        this.config.SearchBarStyle.BorderColor !== ''
          ? this.config.SearchBarStyle.BorderColor
          : this.theme.Color.Gray[100],
      Collapse: this.config.SearchBarStyle.Collapse,
      Width: this.config.SearchBarStyle.Width,
    };
  }

  setSearchBarStyle(style: Partial<SearchBarStyle>) {
    this.config.SearchBarStyle = {
      ...this.config.SearchBarStyle,
      ...style,
    };
  }

  setMessageMenuStyle(style: Partial<MessageMenuStyle>) {
    this.config.MessageMenuStyle = {
      ...this.config.MessageMenuStyle,
      ...style,
    };
  }

  setHighlightedMessageStyle(style: Partial<HighlightedMessageStyle>) {
    if (style.HighlightedFocusedMessageColor)
      this.config.HighlightedFocusedMessageColor =
        style.HighlightedFocusedMessageColor;
    if (style.HighlightedOtherMessageColor)
      this.config.HighlightedOtherMessageColor =
        style.HighlightedOtherMessageColor;
    if (style.HighlightedTextColor)
      this.config.HighlightedTextColor = style.HighlightedTextColor;
  }

  setAutoMessageStyle(style: Partial<AutoMessageStyle>) {
    if (style.AutoMessageBackgroundColor)
      this.config.AutoMessageBackgroundColor = style.AutoMessageBackgroundColor;
    if (style.AutoMessageTextColor)
      this.config.AutoMessageTextColor = style.AutoMessageTextColor;
  }

  setInputMessageStyle(style: Partial<InputMessageStyle>) {
    this.config.InputMessageStyle = {
      ...this.config.InputMessageStyle,
      ...style,
    };
  }

  get ReactionChipStyle(): {
    BorderColor: string;
    BackgroundColor: string;
  } {
    return {
      BorderColor:
        this.config.ReactionChipStyle.BorderColor !== ''
          ? this.config.ReactionChipStyle.BorderColor
          : this.theme.Color.Blue[500],
      BackgroundColor:
        this.config.ReactionChipStyle.BackgroundColor !== ''
          ? this.config.ReactionChipStyle.BackgroundColor
          : this.theme.Color.Blue[100],
    };
  }

  get MsgMenuType() {
    return this.config.MsgMenuType;
  }

  get MsgDeliverTabType(): string[] {
    return this.config.MsgDeliverTabType;
  }

  get BottomItemsType(): T.BottomItemsType {
    return {
      Album: this.config.BottomItemsType.Album,
      Camera: this.config.BottomItemsType.Camera,
      Drive: this.config.BottomItemsType.Drive,
      Drawer: this.config.BottomItemsType.Drawer,
      File: this.config.BottomItemsType.File,
      Notice: this.config.BottomItemsType.Notice,
      Vote: this.config.BottomItemsType.Vote,
      Mail: this.config.BottomItemsType.Mail,
      Contact: this.config.BottomItemsType.Contact,
      Reserve: this.config.BottomItemsType.Reserve,
    };
  }

  setBottomItemsType(type: Partial<T.BottomItemsType>) {
    this.config.BottomItemsType = {
      ...this.config.BottomItemsType,
      ...type,
    };
  }

  get FeatureNameType(): {
    Room: string;
    Talk: string;
    RoomExit: string;
    RoomExitDesc: string;
    DmRoomExitButton: string;
    MiniChat: string;
  } {
    return {
      Room: this.config.FeatureNameType.Room,
      Talk: this.config.FeatureNameType.Talk,
      RoomExit: this.config.FeatureNameType.RoomExit,
      RoomExitDesc: this.config.FeatureNameType.RoomExitDesc,
      DmRoomExitButton: this.config.FeatureNameType.DmRoomExitButton,
      MiniChat: this.config.FeatureNameType.MiniChat,
    };
  }

  get FooterMenuItems(): T.FooterMenuItemsType {
    return {
      Mail: this.config.FooterMenuItems.Mail,
      Emoticon: this.config.FooterMenuItems.Emoticon,
      Vote: this.config.FooterMenuItems.Vote,
      Notice: this.config.FooterMenuItems.Notice,
      File: this.config.FooterMenuItems.File,
      Reserve: this.config.FooterMenuItems.Reserve,
      Editor: this.config.FooterMenuItems.Editor,
    };
  }

  setFooterMenuItems(type: Partial<T.FooterMenuItemsType>) {
    this.config.FooterMenuItems = {
      ...this.config.FooterMenuItems,
      ...type,
    };
  }

  get RoomMenuItemsType(): {
    RoomLeaderRoomDelete: boolean;
    MemberInvite: boolean;
    DMMemberInvite: boolean;
    InviteURLCopy: boolean;
    File: boolean;
    Link: boolean;
    Meeting: boolean | undefined;
    RoomMenuFooterExit: boolean;
    RoomSetting: boolean;
    Pin: boolean;
  } {
    return {
      RoomLeaderRoomDelete: this.config.RoomMenuItemsType.RoomLeaderRoomDelete,
      MemberInvite: this.config.RoomMenuItemsType.MemberInvite,
      DMMemberInvite: this.config.RoomMenuItemsType.DMMemberInvite,
      InviteURLCopy: this.config.RoomMenuItemsType.InviteURLCopy,
      File: this.config.RoomMenuItemsType.File,
      Link: this.config.RoomMenuItemsType.Link,
      Meeting: this.config.RoomMenuItemsType.Meeting,
      RoomMenuFooterExit: this.config.RoomMenuItemsType.RoomMenuFooterExit,
      RoomSetting: this.config.RoomMenuItemsType.RoomSetting,
      Pin: this.config.RoomMenuItemsType.Pin,
    };
  }

  get RoomListTitle(): string {
    return this.config.RoomList.Title;
  }

  get RoomListRoomAlias(): string {
    return this.config.RoomList.RoomAlias;
  }

  get RoomListShowProfile(): boolean {
    return this.config.RoomList.ShowProfile;
  }

  get RoomListShowCreateRoomButton(): boolean {
    return this.config.RoomList.ShowCreateRoomButton;
  }

  get RoomListShowSearchRoomButton(): boolean {
    return this.config.RoomList.SearchRoom.ShowButton;
  }

  get RoomListRoomSearchButtonIcon(): any {
    return this.config.RoomList.SearchRoom.ButtonIcon;
  }

  get RoomListRoomTypeIds(): {
    RoomList: number[] | undefined;
    CreateRoom: number[] | undefined;
  } {
    return {
      RoomList: this.config.RoomList.RoomTypeIds.RoomList,
      CreateRoom: this.config.RoomList.RoomTypeIds.CreateRoom,
    };
  }

  get headerMenuTitle(): string {
    return this.config.HeaderMenuTitle;
  }

  get headerMenuAppsTitle(): string {
    return this.config.HeaderMenuAppsTitle;
  }

  get HeaderMenuItems(): {
    DateSearch: boolean;
    Drawer: boolean;
    Drive: boolean;
    Calendar: boolean;
    Meeting: boolean;
    MiniChat: boolean;
    KeywordSearch: boolean;
    RoomMenu: boolean;
  } {
    return {
      DateSearch: this.config.HeaderMenuItems.DateSearch,
      Drawer: this.config.HeaderMenuItems.Drawer,
      Drive: this.config.HeaderMenuItems.Drive,
      Calendar: this.config.HeaderMenuItems.Calendar,
      Meeting: this.config.HeaderMenuItems.Meeting,
      MiniChat: this.config.HeaderMenuItems.MiniChat,
      KeywordSearch: this.config.HeaderMenuItems.KeywordSearch,
      RoomMenu: this.config.HeaderMenuItems.RoomMenu,
    };
  }

  get ShowHeaderItemName(): boolean {
    return this.config.ShowHeaderItemName;
  }

  setHeaderMenuItems(type: Partial<T.HeaderMenuItemsType>) {
    this.config.HeaderMenuItems = {
      ...this.config.HeaderMenuItems,
      ...type,
    };
  }

  setTheme(theme: Theme) {
    this.theme = theme;
  }

  get RoomEnter(): boolean {
    return this.config.roomEnter.common;
  }

  get DmRoomEnter(): boolean {
    return this.config.roomEnter.dmRoom;
  }

  get hasMyRoom(): boolean {
    return this.config.hasMyRoom;
  }

  setRoomEnter(bool: boolean) {
    this.config.roomEnter.common = bool;
    this.config.roomEnter.dmRoom = bool;
  }

  get CanDeleteEditContents(): {
    Delete: { RoomLeader: boolean; Admin: boolean };
    Edit: { RoomLeader: boolean; Admin: boolean };
  } {
    return {
      Delete: {
        RoomLeader: this.config.CanDeleteEditContents.Delete.RoomLeader,
        Admin: this.config.CanDeleteEditContents.Delete.Admin,
      },
      Edit: {
        RoomLeader: this.config.CanDeleteEditContents.Edit.RoomLeader,
        Admin: this.config.CanDeleteEditContents.Edit.Admin,
      },
    };
  }

  get DialogHeaderStyle(): {
    Icon: boolean;
    Background: boolean;
  } {
    return {
      Icon: this.config.DialogHeaderStyle.Icon,
      Background: this.config.DialogHeaderStyle.Background,
    };
  }

  get ProfileDialogVisible(): boolean {
    return this.config.ProfileDialog.Visible;
  }

  get ProfileDialogMessageButton(): boolean {
    return this.config.ProfileDialog.MessageButton;
  }

  setProfileDialogVisible(profileDialogVisible: boolean) {
    this.config.ProfileDialog.Visible = profileDialogVisible;
  }
  setSupportedExtensions(extensions: T.Extension[]) {
    this.config.SupportedExtensions = [
      ...((extensions.includes('image') && IMAGE_EXTENSIONS) || []),
      ...((extensions.includes('executable') && EXECUTABLE_EXTENSIONS) || []),
      ...((extensions.includes('media') && MEDIA_EXTENSIONS) || []),
      ...((extensions.includes('voice') && VOICE_EXTENSIONS) || []),
      ...((extensions.includes('docs') && DOCS_EXTENSIONS) || []),
      ...((extensions.includes('zip') && ZIP_EXTENSIONS) || []),
    ];

    this.config.UnsupportedExtensions = [
      ...((!extensions.includes('image') && IMAGE_EXTENSIONS) || []),
      ...((!extensions.includes('executable') && EXECUTABLE_EXTENSIONS) || []),
      ...((!extensions.includes('media') && MEDIA_EXTENSIONS) || []),
      ...((!extensions.includes('voice') && VOICE_EXTENSIONS) || []),
      ...((!extensions.includes('docs') && DOCS_EXTENSIONS) || []),
      ...((!extensions.includes('zip') && ZIP_EXTENSIONS) || []),
    ];
  }

  get supportedExtensions(): string[] {
    return this.config.SupportedExtensions;
  }
  get unsupportedExtensions(): string[] {
    return this.config.UnsupportedExtensions;
  }

  isSupportedFile(extension: string): boolean {
    return this.supportedExtensions.includes(extension);
  }

  isUnsupportedFile(extension: string): boolean {
    return this.unsupportedExtensions.includes(extension);
  }

  get ShowRoomTypeIcon(): {
    Open: boolean;
  } {
    return {
      Open: this.config.ShowRoomTypeIcon.Open,
    };
  }

  get MeetingAvailableRoomTypeNames(): string[] {
    return this.config.MeetingAvailableRoomTypeNames;
  }

  get ShowRecentEmoticons(): boolean {
    return this.config.ShowRecentEmoticons;
  }

  get MemberSelectorSearchKeys(): T.MemberSelectorSearchType[] | undefined {
    return this.config.MemberSelectorSearchKeys;
  }

  get AppNames(): {
    File: string;
    Drive: string;
    Calendar: string;
    Meeting: string;
  } {
    return this.config.AppNames;
  }

  get FileOpenType(): T.FileOpenType | undefined {
    return this.config.FileOpenType;
  }
}
