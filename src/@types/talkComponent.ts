import {
  AutoMessageStyle,
  HighlightedMessageStyle,
  InputMessageStyle,
  MessageMenuStyle,
  MessageStyle,
  SearchBarStyle,
} from '@/stores/configStore';
import * as T from '@types';

export interface TalkComponentProps {
  width?: number;
  height?: number;
  roomMenuItems?: React.ReactNode[];
  roomFooterMenuItems?: React.ReactNode[];
  windowButton?: React.ReactNode;
  onFileChipClick?: (fileId?: number | string) => void;
  supportedFileType?: T.Extension[];
  appId?: string;
  docsUploadCallback?: (fileId: number) => void;
  headerVisible?: boolean;
  style?: {
    SearchBarStyle?: Partial<SearchBarStyle>;
    HeaderColor?: string;
    OtherMessageStyle?: Partial<MessageStyle>;
    MyMessageStyle?: Partial<MessageStyle>;
    HighlightedMessageStyle?: Partial<HighlightedMessageStyle>;
    MessageMenuStyle?: Partial<MessageMenuStyle>;
    AutoMessageStyle?: Partial<AutoMessageStyle>;
    BodyColor?: string;
    MainColor?: string;
    FloatingButtonBackgroundColor?: string;
    FloatingButtonColor?: string;
    ButtonPrimaryColor?: string;
    InputMessageStyle?: Partial<InputMessageStyle>;
  };
  messageMenu?: T.MessageMenu[];
  footerMenu?: Partial<T.FooterMenuItemsType>;
  headerMenu?: Partial<T.HeaderMenuItemsType>;
  mobileBottomItems?: Partial<T.BottomItemsType>;
  useRoomEnterTime?: boolean;
  showFullScreenViewer?: boolean;
}
